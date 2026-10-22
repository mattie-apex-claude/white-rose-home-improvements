export interface WebsiteEnquiryEnv {
  APEX_WEBSITE_ENDPOINT: string
  APEX_WEBSITE_ID: string
  APEX_WEBSITE_SECRET: string
  WEBSITE_FORM_FIELDS?: string
  WEBSITE_SUCCESS_PATH?: string
}

type PagesContext = { request: Request; env: WebsiteEnquiryEnv }
type CanonicalField = 'name' | 'address' | 'postcode' | 'phone' | 'service' | 'message' | 'email'
type FieldMap = Record<CanonicalField, string> & { honeypot?: string }

const canonicalFields: CanonicalField[] = ['name', 'address', 'postcode', 'phone', 'service', 'message', 'email']
const maxBytes = 32 * 1024
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const safeFieldCodes = new Set(['required', 'invalid', 'too_long', 'invalid_format'])
const safeErrorStatuses = new Set([400, 403, 409, 413, 415, 422, 429, 500, 502, 503, 504])
const fieldNames = new Set<string>([...canonicalFields, 'submission_id', 'page_source', 'turnstile_token'])

class AdapterError extends Error {
  constructor(readonly status: number, readonly code: string) {
    super(code)
  }
}

function wantsJson(request: Request): boolean {
  return (request.headers.get('Accept') ?? '').split(',').some((part) => {
    const [mediaType, ...parameters] = part.trim().toLowerCase().split(';')
    return mediaType === 'application/json' && !parameters.some((value) => /^\s*q=0(?:\.0*)?\s*$/.test(value))
  })
}

function reply(request: Request, status: number, code: string, fields?: Record<string, string>): Response {
  const messages: Record<string, string> = {
    method_not_allowed: 'Please submit the enquiry using the form.',
    invalid_origin: 'Please submit the enquiry from this website.',
    invalid_form: 'Please check the enquiry fields and try again.',
    body_too_large: 'Your enquiry is too large. Please shorten the message.',
    unsupported_media_type: 'Please submit the enquiry using the form.',
    client_ip_unavailable: 'We could not verify this request securely. Please try again later.',
    configuration_error: 'Enquiries are temporarily unavailable. Please try again later.',
    upstream_unavailable: 'We could not confirm your enquiry. Please retry with the same submission ID.',
    rejected: 'We could not accept your enquiry. Please check the form and try again.',
    rate_limited: 'Too many enquiries. Please wait before trying again.',
  }
  const headers = new Headers({
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    Vary: 'Accept',
  })
  if (status === 405) headers.set('Allow', 'POST')
  if (wantsJson(request)) {
    headers.set('Content-Type', 'application/json; charset=utf-8')
    return new Response(JSON.stringify({ status: 'error', code, ...(fields && Object.keys(fields).length ? { fields } : {}) }), { status, headers })
  }
  headers.set('Content-Type', 'text/plain; charset=utf-8')
  return new Response(messages[code] ?? messages.rejected, { status, headers })
}

function absoluteUrl(value: string): URL {
  if (!/^https?:\/\//i.test(value) || value.trim() !== value) throw new Error('invalid URL')
  const url = new URL(value)
  if (url.username || url.password) throw new Error('invalid URL')
  return url
}

function localHost(url: URL): boolean {
  return ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
}

function configuration(env: WebsiteEnquiryEnv, requestUrl: URL): { endpoint: URL; fields: FieldMap; successPath: string } {
  try {
    const endpoint = absoluteUrl(env.APEX_WEBSITE_ENDPOINT)
    if (endpoint.protocol !== 'https:' && !(endpoint.protocol === 'http:' && localHost(endpoint) && localHost(requestUrl))) throw new Error('insecure endpoint')
    if (endpoint.pathname !== '/functions/v1/website-enquiry' || endpoint.search || endpoint.hash) throw new Error('invalid endpoint')
    if (!uuidPattern.test(env.APEX_WEBSITE_ID) || !/^[0-9a-f]{64}$/i.test(env.APEX_WEBSITE_SECRET)) throw new Error('invalid credentials')
    const fields: FieldMap = { name: 'name', address: 'address', postcode: 'postcode', phone: 'phone', service: 'service', message: 'message', email: 'email' }
    if (env.WEBSITE_FORM_FIELDS !== undefined) {
      const mapping: unknown = JSON.parse(env.WEBSITE_FORM_FIELDS)
      if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) throw new Error('invalid mapping')
      for (const [key, value] of Object.entries(mapping)) {
        if (![...canonicalFields, 'honeypot'].includes(key) || typeof value !== 'string' || !value.trim() || value.length > 128) throw new Error('invalid mapping')
        Object.defineProperty(fields, key, { value, enumerable: true, configurable: true, writable: true })
      }
    }
    const mappedNames = Object.values(fields)
    if (new Set(mappedNames).size !== mappedNames.length || mappedNames.some((name) => ['submission_id', 'page_source', 'cf-turnstile-response'].includes(name))) throw new Error('ambiguous mapping')
    const successPath = env.WEBSITE_SUCCESS_PATH ?? '/thank-you/'
    if (!/^\/(?!\/)[a-zA-Z0-9/_-]*$/.test(successPath)) throw new Error('invalid success path')
    return { endpoint, fields, successPath }
  } catch {
    throw new AdapterError(503, 'configuration_error')
  }
}

function checkOrigin(request: Request, requestUrl: URL): URL | undefined {
  try {
    const originValue = request.headers.get('Origin')
    if (!originValue) throw new Error('missing origin')
    const origin = absoluteUrl(originValue)
    if (originValue !== origin.origin || origin.origin !== requestUrl.origin) throw new Error('wrong origin')
    const refererValue = request.headers.get('Referer')
    if (!refererValue) return undefined
    const referer = absoluteUrl(refererValue)
    if (referer.origin !== requestUrl.origin) throw new Error('wrong referer')
    referer.hash = ''
    return referer
  } catch {
    throw new AdapterError(403, 'invalid_origin')
  }
}

function clientIp(request: Request): string {
  const ip = request.headers.get('CF-Connecting-IP')
  if (!ip || ip.length > 45 || !/^[0-9a-f:.]+$/i.test(ip)) throw new AdapterError(503, 'client_ip_unavailable')
  if (ip.includes(':')) {
    try {
      const parsed = new URL(`https://[${ip}]/`)
      if (!parsed.hostname.startsWith('[')) throw new Error('invalid IP')
    } catch {
      throw new AdapterError(503, 'client_ip_unavailable')
    }
  } else {
    const parts = ip.split('.')
    if (parts.length !== 4 || parts.some((part) => !/^(0|[1-9]\d{0,2})$/.test(part) || Number(part) > 255)) throw new AdapterError(503, 'client_ip_unavailable')
  }
  return ip
}

async function boundedForm(request: Request): Promise<FormData> {
  const contentType = request.headers.get('Content-Type') ?? ''
  if (!/^(application\/x-www-form-urlencoded|multipart\/form-data)(?:\s*;|$)/i.test(contentType)) throw new AdapterError(415, 'unsupported_media_type')
  const length = request.headers.get('Content-Length')
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > maxBytes)) throw new AdapterError(413, 'body_too_large')
  if (!request.body) throw new AdapterError(400, 'invalid_form')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) {
        await reader.cancel()
        throw new AdapterError(413, 'body_too_large')
      }
      chunks.push(value)
    }
  } catch (error) {
    if (error instanceof AdapterError) throw error
    throw new AdapterError(400, 'invalid_form')
  } finally {
    reader.releaseLock()
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  try {
    const form = await new Request(request.url, { method: 'POST', headers: { 'Content-Type': contentType }, body: bytes }).formData()
    for (const value of form.values()) {
      if (typeof value !== 'string') throw new Error('files not accepted')
    }
    return form
  } catch {
    throw new AdapterError(400, 'invalid_form')
  }
}

function text(form: FormData, name: string): string {
  const values = form.getAll(name)
  if (values.length > 1 || values.some((value) => typeof value !== 'string')) throw new AdapterError(400, 'invalid_form')
  return typeof values[0] === 'string' ? values[0].trim() : ''
}

function sourcePage(form: FormData, referer: URL | undefined, requestUrl: URL): string {
  const hidden = text(form, 'page_source')
  let page: URL | undefined
  if (hidden) {
    try {
      page = absoluteUrl(hidden)
      if (page.origin !== requestUrl.origin) throw new Error('wrong page origin')
      page.hash = ''
    } catch {
      throw new AdapterError(400, 'invalid_form')
    }
  }
  if (referer) return referer.href
  if (page) return page.href
  throw new AdapterError(400, 'invalid_form')
}

function safeFields(body: unknown): Record<string, string> | undefined {
  if (!body || typeof body !== 'object' || !('fields' in body)) return undefined
  const fields = body.fields
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return undefined
  return Object.fromEntries(Object.entries(fields).filter(([key, code]) => fieldNames.has(key) && typeof code === 'string' && safeFieldCodes.has(code))) as Record<string, string>
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request, env } = context
  if (request.method !== 'POST') return reply(request, 405, 'method_not_allowed')
  try {
    const requestUrl = new URL(request.url)
    const referer = checkOrigin(request, requestUrl)
    const config = configuration(env, requestUrl)
    const ip = clientIp(request)
    const form = await boundedForm(request)
    const submissionId = text(form, 'submission_id')
    if (!uuidPattern.test(submissionId)) throw new AdapterError(400, 'invalid_form')
    const fields = Object.fromEntries(canonicalFields.map((name) => [name, text(form, config.fields[name])]))
    if (!fields.name || !fields.phone || !fields.service) throw new AdapterError(400, 'invalid_form')
    const turnstileToken = text(form, 'cf-turnstile-response')
    if (!turnstileToken) throw new AdapterError(400, 'invalid_form')
    const payload = {
      submission_id: submissionId,
      ...fields,
      page_source: sourcePage(form, referer, requestUrl),
      turnstile_token: turnstileToken,
      ...(config.fields.honeypot ? { website: text(form, config.fields.honeypot) } : {}),
    }
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15_000)
    let status: number
    let body: unknown
    try {
      const response = await fetch(config.endpoint.href, {
        method: 'POST',
        redirect: 'error',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-apex-website-id': env.APEX_WEBSITE_ID,
          'x-apex-website-secret': env.APEX_WEBSITE_SECRET,
          'x-apex-client-ip': ip,
        },
        body: JSON.stringify(payload),
      })
      status = response.status
      if (status === 200 || status === 201) {
        await response.body?.cancel()
      } else {
        try {
          body = await response.json()
        } catch {
          body = undefined
        }
      }
    } catch {
      throw new AdapterError(503, 'upstream_unavailable')
    } finally {
      clearTimeout(timer)
    }
    if (status === 200 || status === 201) {
      const headers = { 'Cache-Control': 'no-store', Vary: 'Accept', 'X-Content-Type-Options': 'nosniff' }
      if (wantsJson(request)) return Response.json({ status: 'accepted', submission_id: submissionId }, { status, headers })
      return new Response(null, { status: 303, headers: { ...headers, Location: config.successPath } })
    }
    if (!safeErrorStatuses.has(status)) throw new AdapterError(503, 'upstream_unavailable')
    return reply(request, status, status === 429 ? 'rate_limited' : status >= 500 ? 'upstream_unavailable' : 'rejected', safeFields(body))
  } catch (error) {
    if (error instanceof AdapterError) return reply(request, error.status, error.code)
    return reply(request, 503, 'upstream_unavailable')
  }
}