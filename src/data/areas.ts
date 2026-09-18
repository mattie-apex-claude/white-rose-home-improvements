export interface Area {
	slug: string;
	name: string;
	heading: string;
	metaTitle: string;
	metaDescription: string;
	intro: string;
	coverageNote: string;
	nearby: string[];
	faqs: { question: string; answer: string }[];
}

export const areas: Area[] = [
	{
		slug: 'tadcaster',
		name: 'Tadcaster',
		heading: 'Landscaping & Home Improvements in Tadcaster',
		metaTitle: 'Landscaping in Tadcaster | White Rose Home Improvements',
		metaDescription:
			'White Rose Home Improvements is based in Tadcaster, offering fencing, paving, decking, turfing and garden care to homeowners across the town and surrounding villages.',
		intro:
			"Tadcaster is home for White Rose Home Improvements, so it's where we know the ground, the weather and the local building styles best. From riverside gardens near the Wharfe to newer estates on the edge of town, we've fenced, paved, decked and turfed our way around most of it.",
		coverageNote:
			"Being based here means shorter travel times, easier site visits and no cross-county scheduling to work around. If you're in Tadcaster, we can usually get out to look at your project quickly.",
		nearby: ['boston-spa', 'wetherby', 'york'],
		faqs: [
			{
				question: 'Do you offer free quotes for Tadcaster homeowners?',
				answer:
					'Yes. As we\'re based in Tadcaster, arranging a free, no-obligation home visit and quote is usually quick and easy to schedule.',
			},
			{
				question: 'How soon can you start a project in Tadcaster?',
				answer:
					'Timescales depend on the season and current workload, but being local to Tadcaster means we can often turn projects around faster than further afield.',
			},
			{
				question: 'What services do you offer in Tadcaster?',
				answer:
					'We provide fencing, paving, decking, turfing, outdoor joinery and carpentry, sheds and garden rooms, and garden care and maintenance across Tadcaster.',
			},
		],
	},
	{
		slug: 'boston-spa',
		name: 'Boston Spa',
		heading: 'Landscaping & Home Improvements in Boston Spa',
		metaTitle: 'Landscaping in Boston Spa | White Rose Home Improvements',
		metaDescription:
			'White Rose Home Improvements works throughout Boston Spa, providing fencing, paving, decking, turfing and garden care for homes along the River Wharfe and beyond.',
		intro:
			"Boston Spa sits right alongside Tadcaster as our home patch. It's a village with a lot of character — period stone cottages, riverside plots and family gardens — and we've built fencing, paving and decking projects to suit all of them.",
		coverageNote:
			'As one of our two base villages, Boston Spa gets the same quick response and local knowledge as Tadcaster. We understand the mix of period and modern properties here and design around it.',
		nearby: ['tadcaster', 'wetherby', 'leeds'],
		faqs: [
			{
				question: 'Are you local to Boston Spa?',
				answer:
					'Yes, Boston Spa is one of our two home bases alongside Tadcaster, so we know the village and surrounding area well.',
			},
			{
				question: 'Can you work on period properties in Boston Spa?',
				answer:
					'Absolutely. We regularly design fencing, paving and outdoor joinery that suits both period stone cottages and newer homes in Boston Spa.',
			},
			{
				question: 'What areas near Boston Spa do you also cover?',
				answer:
					'We regularly work between Boston Spa, Tadcaster, Wetherby and Leeds, along with the wider West and North Yorkshire area.',
			},
		],
	},
	{
		slug: 'wetherby',
		name: 'Wetherby',
		heading: 'Landscaping & Home Improvements in Wetherby',
		metaTitle: 'Landscaping in Wetherby | White Rose Home Improvements',
		metaDescription:
			'Fencing, paving, decking, turfing and garden care for homeowners in Wetherby, a short drive from our Tadcaster and Boston Spa base.',
		intro:
			"Wetherby is one of our closest neighbouring towns, just a short drive from our Tadcaster base. It's a market town with a good mix of established family homes and newer developments, and we regularly work on fencing, paving and decking projects here.",
		coverageNote:
			"We're in and around Wetherby often, whether that's a full garden transformation or a smaller fencing repair, so getting a home visit arranged is straightforward.",
		nearby: ['tadcaster', 'boston-spa', 'harrogate'],
		faqs: [
			{
				question: 'How far is Wetherby from your Tadcaster base?',
				answer:
					"Wetherby is only a short drive from Tadcaster, so we're able to visit quickly and keep travel costs sensible.",
			},
			{
				question: 'Do you install fencing and paving together in Wetherby?',
				answer:
					'Yes, many Wetherby projects combine fencing with paving or decking as part of a wider garden refresh, and we can plan the whole job together.',
			},
			{
				question: 'What garden styles do you work with in Wetherby?',
				answer:
					'From traditional cottage gardens to modern low-maintenance layouts, we design fencing, paving and turfing to suit the property and how you use the space.',
			},
		],
	},
	{
		slug: 'harrogate',
		name: 'Harrogate',
		heading: 'Landscaping & Home Improvements in Harrogate',
		metaTitle: 'Landscaping in Harrogate | White Rose Home Improvements',
		metaDescription:
			'White Rose Home Improvements provides fencing, paving, decking and garden care to homeowners across Harrogate and the surrounding North Yorkshire area.',
		intro:
			"Harrogate's leafy streets and well-established gardens call for landscaping that matches the setting. We work across the town on fencing, paving, decking and outdoor joinery projects, from period townhouses to homes on the newer edges of Harrogate.",
		coverageNote:
			"Harrogate is a little further north for us, but it's an area we visit regularly, and we plan projects here with the same care and attention as our home patch.",
		nearby: ['wetherby', 'york', 'tadcaster'],
		faqs: [
			{
				question: 'Do you travel to Harrogate for garden projects?',
				answer:
					'Yes, we regularly work across Harrogate and the surrounding North Yorkshire area, alongside our base in Tadcaster and Boston Spa.',
			},
			{
				question: 'What services are most requested in Harrogate?',
				answer:
					'Fencing, paving and decking are popular in Harrogate, often as part of a wider garden makeover, along with ongoing garden care and maintenance.',
			},
			{
				question: 'Can you match landscaping to a period Harrogate property?',
				answer:
					"Yes, we take the property's character into account when designing fencing, paving and outdoor joinery, so the finished result feels right at home.",
			},
		],
	},
	{
		slug: 'leeds',
		name: 'Leeds',
		heading: 'Landscaping & Home Improvements in Leeds',
		metaTitle: 'Landscaping in Leeds | White Rose Home Improvements',
		metaDescription:
			'Fencing, paving, decking, turfing and garden care across Leeds, from Victorian terraces to new-build estates, delivered by White Rose Home Improvements.',
		intro:
			"Leeds gives us the widest mix of properties we work with — Victorian terraces with small courtyard gardens, suburban semis, and newer estates with larger plots. Whatever the starting point, we bring the same fencing, paving, decking and turfing standard across the city.",
		coverageNote:
			"We work throughout Leeds and its surrounding suburbs regularly, travelling out from our Tadcaster and Boston Spa base for everything from single fence repairs to full garden transformations.",
		nearby: ['boston-spa', 'wetherby', 'york'],
		faqs: [
			{
				question: 'Do you cover all areas of Leeds?',
				answer:
					'We work across Leeds and the surrounding suburbs, and are happy to discuss your specific location when you get in touch for a quote.',
			},
			{
				question: 'Can you work with small, enclosed Leeds gardens?',
				answer:
					'Yes, we regularly design fencing, paving and decking for smaller courtyard and terrace gardens as well as larger suburban plots.',
			},
			{
				question: 'How do I get a quote for a Leeds project?',
				answer:
					'Get in touch through our contact page with your address and a little detail about the project, and we will arrange a free home visit.',
			},
		],
	},
	{
		slug: 'york',
		name: 'York',
		heading: 'Landscaping & Home Improvements in York',
		metaTitle: 'Landscaping in York | White Rose Home Improvements',
		metaDescription:
			'White Rose Home Improvements delivers fencing, paving, decking and garden care for homes in York and the surrounding villages, built to suit the local character.',
		intro:
			"York's mix of historic streets and surrounding villages means every garden has its own character to work around. We take that into account on every fencing, paving, decking and turfing project we take on in and around the city.",
		coverageNote:
			"York is one of our regular working areas alongside Leeds, Wetherby and Harrogate, and we're happy to travel out from Tadcaster for projects of any size.",
		nearby: ['harrogate', 'tadcaster', 'leeds'],
		faqs: [
			{
				question: 'Do you work in villages around York, not just the city?',
				answer:
					'Yes, we cover York and the surrounding villages, working with the same standard across town and countryside properties alike.',
			},
			{
				question: 'What services do you offer for York gardens?',
				answer:
					'Fencing, paving, decking, turfing, outdoor joinery and carpentry, sheds and garden rooms, and garden care and maintenance are all available across York.',
			},
			{
				question: 'How do I arrange a free quote in York?',
				answer:
					"Contact us with a few details about your project and location, and we'll arrange a free, no-obligation home visit.",
			},
		],
	},
];

export function getArea(slug: string) {
	const area = areas.find((a) => a.slug === slug);
	if (!area) throw new Error(`Area not found: ${slug}`);
	return area;
}
