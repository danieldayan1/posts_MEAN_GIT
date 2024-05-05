const http = require('http');
const app = require('./backend/app');

const PORT =  process.env.port || 3000;
app.set('port',PORT);

const server = http.createServer(app);
server.listen(PORT);