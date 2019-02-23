import express from 'express';
import bodyParser from 'body-parser';
import connectToDb from './db/connect';
import user from './routes/user.routes';
import classes from './routes/class.router';
import groups from './routes/group.router';
import message from './routes/message.router';
import socketHandler from './socket-handler/index'

//const http = require('http');
const server = express();
const http = require('http').Server(server);
socketHandler.initSocket(http);

connectToDb();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: false
}));
server.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
server.use(express.static('public'));
server.use(express.static('uploads'));
server.use(user);
server.use(classes);
server.use(groups);
server.use(message);

// server.listen(3000, () => {
//     console.log('Server started at: 3000');
// });
http.listen(3000, () => {
    console.log('Server started at: 3000');
});

server.use(function (err, req, res, next) {
    res.status(400).json({
        isSuccess: false,
        message: err.message || 'Have error',
        error: err.stack || err
    });
});
//http.createServer(server);