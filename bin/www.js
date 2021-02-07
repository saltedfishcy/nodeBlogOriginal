const http = require('http');
const PORT = 8000;
const serveHandle = require('../app')
const server = http.createServer(serveHandle);

server.listen(PORT)