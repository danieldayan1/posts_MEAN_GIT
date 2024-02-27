const http = require('http');
const app = require('./backend/app');

const PORT = 3000 || process.env.port;
app.set('port',PORT);

const server = http.createServer(app);
server.listen(PORT);