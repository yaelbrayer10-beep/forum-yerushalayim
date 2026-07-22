'use strict';

require('../require-main');
require('./nodebb-global');

const nconf = require('nconf');
nconf.argv().env({ separator: '__' });

const { paths } = require('./src/constants');
const prestart = require('./src/prestart');
prestart.loadConfig(paths.config);

nconf.set('database', 'mongo');
nconf.set('mongo:uri', process.env.MONGO_URI);
if (!nconf.get('url')) {
	nconf.set('url', process.env.RENDER_EXTERNAL_URL || process.env.FORUM_URL);
}

const db = require('./src/database');
const meta = require('./src/meta');

(async () => {
	await db.init();
	await meta.configs.setMultiple({
		useCompression: 1,
	});
	console.log('Compression enabled');
	process.exit(0);
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
