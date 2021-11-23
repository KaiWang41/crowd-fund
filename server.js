const { createServer } = require('http');
const next = require('next');

const app = next({
	dev: process.env.NODE_ENV || 'production' !== 'production',
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
	const port = process.env.SERVER_PORT || '3000';
	createServer(handler).listen(port, err => {
		if (err) throw err;

		console.log('Ready on localhost:', port);
	});
});
