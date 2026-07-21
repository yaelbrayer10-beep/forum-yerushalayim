'use strict';

require('../require-main');
require('../nodebb-global');

const nconf = require('nconf');
nconf.argv().env({ separator: '__' });

const { paths } = require('../src/constants');
const prestart = require('../src/prestart');

prestart.loadConfig(paths.config);

const db = require('../src/database');
const meta = require('../src/meta');

(async () => {
	await db.init();
	await meta.configs.setMultiple({
		title: 'פורום ירושלים',
		'title:short': 'פורום ירושלים',
		description: 'פורום קהילתי בעברית - עדכונים, עזרה הדדית, נדל"ן ועוד',
		defaultLang: 'he',
		allowRegistration: 1,
		requireEmailConfirmation: 0,
	});
	console.log('META_DONE');
	process.exit(0);
})().catch((err) => { console.error(err); process.exit(1); });
