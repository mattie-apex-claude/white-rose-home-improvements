export interface Service {
	slug: string;
	title: string;
	short: string;
	image: string;
	heroImage: string;
	gallery: string[];
}

export const services: Service[] = [
	{
		slug: 'fencing',
		title: 'Fencing',
		short: 'Timber and concrete fencing built to last, tailored to your boundary and style.',
		image: '/Images/Services/Fences/Timber Posts & Panels.jpg',
		heroImage: '/Images/Services/Fences/Timber and Concrete Posts + Boards.png',
		gallery: [
			'/Images/Services/Fences/Eco Posts & Boards + Timber Panels.jpg',
			'/Images/Services/Fences/Timber Fence & Posts - Driveways.png',
			'/Images/Services/Fences/Timber Posts and Panels 3.png',
		],
	},
	{
		slug: 'paving',
		title: 'Paving & Patios',
		short: 'Bespoke Indian sandstone and paved patios, driveways and pathways.',
		image: '/Images/Services/Paving : Patios/Raj Green : mixed sandstone with a circular patio feature.png',
		heroImage: '/Images/Services/Paving : Patios/Paving.png',
		gallery: [
			'/Images/Services/Paving : Patios/Indian Sandstone.png',
			'/Images/Services/Paving : Patios/Mixed grey and buff Indian sandstone.png',
			'/Images/Services/Paving : Patios/Fossil Mint sandstone close-up.png',
			'/Images/Services/Paving : Patios/Project/bespoke Indian sandstone sett pathway with a sunburst : radiating fan circle feature./1.png',
			'/Images/Services/Paving : Patios/Project/bespoke Indian sandstone sett pathway with a sunburst : radiating fan circle feature./3.png',
			'/Images/Services/Paving : Patios/Project/bespoke Indian sandstone sett pathway with a sunburst : radiating fan circle feature./5.png',
		],
	},
	{
		slug: 'outdoor-joinery-carpentry',
		title: 'Outdoor Joinery & Carpentry',
		short: 'Bespoke timber structures and carpentry, built with precision and care.',
		image: '/Images/Services/Outdoor Joinery : Carpentry /Summer House.jpg',
		heroImage: '/Images/Services/Outdoor Joinery : Carpentry /Summer House.jpg',
		gallery: ['/Images/Services/Outdoor Joinery : Carpentry /Summer House.jpg'],
	},
	{
		slug: 'sheds-garden-rooms',
		title: 'Sheds & Garden Rooms',
		short: 'Beautiful, functional garden rooms and storage built around how you live.',
		image: '/Images/Services/Outdoor Joinery : Carpentry /Summer House.jpg',
		heroImage: '/Images/Services/Outdoor Joinery : Carpentry /Summer House.jpg',
		gallery: ['/Images/Services/Outdoor Joinery : Carpentry /Summer House.jpg'],
	},
	{
		slug: 'decking',
		title: 'Decking',
		short: 'Considered decking that extends your living space into the garden.',
		image: '/Images/Services/Decking/Decking Project 1/Decking 1.jpg',
		heroImage: '/Images/Services/Decking/Decking Project 1/Decking 2.jpg',
		gallery: [
			'/Images/Services/Decking/Decking Project 1/Decking 1.jpg',
			'/Images/Services/Decking/Decking Project 1/799346352_17900003628597812_3194423728548902632_n.jpg',
		],
	},
	{
		slug: 'turfing',
		title: 'Turfing',
		short: 'Natural and artificial turf, laid to give an immaculate, lasting lawn.',
		image: '/Images/Services/Turfing /Turfing 3.png',
		heroImage: '/Images/Services/Turfing /Turfing 1 .png',
		gallery: [
			'/Images/Services/Turfing /Turfing 2 .png',
			'/Images/Services/Turfing /Turfing 4 (Artifical).png',
		],
	},
	{
		slug: 'garden-care-maintenance',
		title: 'Garden Care & Maintenance',
		short: 'Ongoing care that keeps outdoor spaces looking their considered best.',
		image: '/Images/Services/Garden Care : Maintainance/Hedge Cutting .png',
		heroImage: '/Images/Services/Garden Care : Maintainance/Hedge Cutting .png',
		gallery: ['/Images/Services/Garden Care : Maintainance/Hedge Cutting .png'],
	},
];

export function getService(slug: string): Service {
	const service = services.find((s) => s.slug === slug);
	if (!service) {
		throw new Error(`Unknown service slug: ${slug}`);
	}
	return service;
}
