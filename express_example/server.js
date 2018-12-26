import express from 'express';
import bodyParser from 'body-parser';
import connectToDb from './db/connect';
import user from './routes/user.routes';
import classes from './routes/class.router';
import groups from './routes/group.router'

const http = require('http');
const server = express();

connectToDb();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: false
}));

server.use(user);
server.use(classes);
server.use(groups);

server.listen(3000, () => {
    console.log('Server started at: 3000');
});
server.use(function (err, req, res, next) {
    res.status(400).json({
        isSuccess: false,
        message: err.message || 'Have error',
        error: err.stack || err
    });
});
http.createServer(server);