const http = require('http');
const app = require('./app');

/* Init Server */
const port = process.env.PORT || 8080;
const server = http.createServer(app);
server.listen(port);
