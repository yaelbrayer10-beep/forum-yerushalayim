'use strict';

require('../require-main');
require('../nodebb-global');

const nconf = require('nconf');
nconf.argv().env({ separator: '__' });

const { paths } = require('../src/constants');
const prestart = require('../src/prestart');

prestart.loadConfig(paths.config);

const db = require('../src/database');
const categories = require('../src/categories');

const tree = [
	{
		name: 'חדשות ועדכונים',
		description: 'חדשות ועדכונים מעיה"ק בני ברק',
		bgColor: '#0d6efd',
		icon: 'fa-newspaper-o',
	},
	{
		name: 'איש את רעהו יעזרו',
		description: 'עזרה הדדית בין תושבי הקהילה',
		bgColor: '#198754',
		icon: 'fa-handshake-o',
		children: [
			{ name: 'תחבורה', description: 'טרמפים, הסעות ותחבורה', icon: 'fa-car' },
			{ name: 'מסירה ויד 2', description: 'מסירת פריטים ומכירת יד שנייה', icon: 'fa-gift' },
			{ name: 'אבדות ומציאות', description: 'פרסום אבדות ומציאות', icon: 'fa-search' },
			{ name: 'גמחי"ם', description: 'גמילות חסדים', icon: 'fa-heart' },
			{ name: 'קהילות ובתי כנסת', description: 'מידע על קהילות ובתי כנסת', icon: 'fa-institution' },
			{ name: 'פרסום', description: 'פרסום מודעות ואירועים', icon: 'fa-bullhorn' },
			{ name: 'בקשות מידע ויעוץ בנושאים שונים', description: 'שאלות ובקשות ייעוץ', icon: 'fa-question-circle' },
		],
	},
	{
		name: 'נדל"ן',
		description: 'מכירה והשכרה של דירות',
		bgColor: '#fd7e14',
		icon: 'fa-building-o',
		children: [
			{ name: 'מכירת דירות', description: 'דירות למכירה', icon: 'fa-key' },
			{ name: 'השכרת דירות', description: 'דירות להשכרה', icon: 'fa-home' },
		],
	},
	{
		name: 'שונות',
		description: 'כל מה שאין לו מקום אחר',
		bgColor: '#6c757d',
		icon: 'fa-th-large',
	},
	{
		name: 'אזור המערכת',
		description: 'הודעות ומכתבים למערכת',
		bgColor: '#20c997',
		icon: 'fa-cogs',
		children: [
			{ name: 'הודעות מערכת', description: 'הודעות רשמיות מהנהלת הפורום', icon: 'fa-bullhorn' },
			{ name: 'מכתבים למערכת', description: 'פניות למנהלי הפורום', icon: 'fa-envelope' },
			{ name: 'הצעות ייעול ובאגים', description: 'דיווחי באגים והצעות שיפור', icon: 'fa-bug' },
		],
	},
];

async function createTree(nodes, parentCid, order) {
	for (const node of nodes) {
		const cat = await categories.create({
			name: node.name,
			description: node.description,
			icon: node.icon,
			bgColor: node.bgColor,
			parentCid: parentCid || 0,
			order: order++,
		});
		console.log(`Created cid=${cat.cid} "${node.name}" parentCid=${parentCid || 0}`);
		if (node.children && node.children.length) {
			await createTree(node.children, cat.cid, 1);
		}
	}
}

(async () => {
	await db.init();
	const existingCids = await categories.getAllCidsFromSet('categories:cid');
	if (existingCids.length) {
		console.log('Categories already exist, skipping seed.');
		process.exit(0);
	}
	await createTree(tree, 0, 1);
	console.log('SEED_DONE');
	process.exit(0);
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
