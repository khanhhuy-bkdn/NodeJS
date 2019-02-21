import express from 'express';
import bodyParser from 'body-parser';
import connectToDb from './db/connect';
import user from './routes/user.routes';
import classes from './routes/class.router';
import groups from './routes/group.router';
import message from './routes/message.router'

//const http = require('http');
const server = express();

const http = require('http').Server(server);
const io = require('socket.io')(http);

/*
This code socket
*/
io.on('connection', function (socket) {
    console.log('a user connected');
    /*
    **Start initializing event
    */
    socket.on('sendingMessage', function (data) {
        console.log('Get data on event');
        console.log(data);
        socket.broadcast.emit('reMessage', data);
    });
    socket.on('sendingTyping', function (data) {
        console.log('Get data on event');
        console.log(data);
        socket.broadcast.emit('sendingTyping', data);
    });
});


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