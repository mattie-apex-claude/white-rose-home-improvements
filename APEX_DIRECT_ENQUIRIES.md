# Direct Apex enquiry integration — White Rose

This branch prepares the existing homepage/contact enquiry form for direct Apex intake without changing its existing live behaviour. The switch is **off by default** and should remain off until the Apex backend is configured and a controlled test passes.

## Already implemented in Apex

See `mattie-apex-claude/apex-crm` for `supabase/migrations/202610220010_website_enquiries.sql`, `supabase/functions/website-enquiry`, the Cloudflare adapter and tests. Follow `docs/DIRECT_WEBSITE_ENQUIRIES.md` there for the schema audit, backup, configuration and approved deployment process. Do not rerun earlier migrations or apply unrelated migration 009.

## This repository

- `functions/api/website-enquiry.ts`: server-side Pages Function forwarding verified requests to Apex; credentials remain Cloudflare server secrets. This copies the Apex adapter.
- `src/components/LeadForm.astro`: existing form preserved. When direct intake is enabled, the form submits once to the same-origin `/api/website-enquiry`, passes a stable submission UUID and page URL, and displays a Cloudflare Turnstile challenge. **No dual posting or automatic fallback** is permitted.

## Environment and Cloudflare configuration

Website build-time public variables:
- `PUBLIC_APEX_DIRECT_ENQUIRIES=true` — **only at approved cutover** (unset/false retains existing live submission route).
- `PUBLIC_TURNSTILE_SITE_KEY` — public site key for the actual registered White Rose hostname.

Cloudflare Pages Function runtime variables / encrypted secrets:
- `APEX_WEBSITE_ENDPOINT=https://oghgjtlhwevgspofazpx.supabase.co/functions/v1/website-enquiry`
- `APEX_WEBSITE_ID` — provisioned website connection UUID, not business ID
- `APEX_WEBSITE_SECRET` — connection's unique secret; encrypted server-side only
- `WEBSITE_FORM_FIELDS` JSON:
  `{"name":"name","address":"address","postcode":"postcode","phone":"contact_number","service":"service","message":"further_information","email":"email"}`
- `WEBSITE_SUCCESS_PATH=/` — safe valid fallback redirect for non-AJAX posts; the existing form uses AJAX success rendering.

The current form has **no email control**, so optional email is sent blank. Do not fabricate an email address. No website form secrets belong in Git, HTML, client JavaScript, build-time public environment variables or logs.

Cloudflare Turnstile action must be `website_enquiry`; configure its secret in Apex backend as described in the Apex runbook. Configure preview and production separately.

## Required before turning the switch on

1. Confirm correct live White Rose tenant, database migrations, existing subscription/feature entitlements, Turnstile hostname and exact deployed Pages Functions route.
2. Back up and apply migration 010 **only if not yet installed**, with explicit approval.
3. Provision a disabled White Rose website connection and server-side secrets.
4. Deploy and test backend function and Pages Function with a controlled test connection. An approved test requires temporarily enabling that verified connection while the public form still uses the original route.
5. Confirm one new enquiry with matching customer/service/address/postcode/message/source appears in White Rose Apex, and the same submission ID does not duplicate it; verify isolation and rejection behaviour.
6. Only after approval, enable `PUBLIC_APEX_DIRECT_ENQUIRIES=true`, redeploy White Rose and verify the live form. Keep prior destination recorded for rollback. Do not cancel existing enquiry notifications until equivalent Apex notifications are tested.

This branch has **not** deployed anything, applied any migration, or verified a live end-to-end request.
