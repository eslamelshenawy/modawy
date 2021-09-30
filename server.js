const http = require('http');
const app = require('./app');


const port = process.env.PORT || 3000;

const server = http.createServer(app);

//  server.listen(port);

server.listen(port, (req, res, next) => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('running at http://' + host + ':' + port)
    console.log(`app listening on port ${port}!`);
});
