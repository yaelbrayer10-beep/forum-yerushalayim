#!/usr/bin/env bash
set -e

# Copy over the template package.json on first install (NodeBB keeps it under install/)
if [ ! -f package.json ]; then
	cp install/package.json package.json
fi

npm install --omit=dev --no-audit --no-fund

# Only run first-time setup if no config.json exists yet in this deploy.
if [ ! -f config.json ]; then
	export SETUP=$(node -e '
		const v = {
			url: process.env.RENDER_EXTERNAL_URL,
			secret: process.env.NODEBB_SECRET,
			database: "mongo",
			"admin:username": process.env.ADMIN_USERNAME,
			"admin:email": process.env.ADMIN_EMAIL,
			"admin:password": process.env.ADMIN_PASSWORD,
			"admin:password:confirm": process.env.ADMIN_PASSWORD,
			"mongo:uri": process.env.MONGO_URI,
		};
		console.log(JSON.stringify(v));
	')
	node nodebb setup --skip-build
	node scripts/configure-meta.js
	node scripts/seed-categories.js
fi

node nodebb build
