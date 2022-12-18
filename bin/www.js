const app = require('../app');
const http = require('http');

/**
 * Get port from environment and store in Express.
 */

const port = 3000;
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);