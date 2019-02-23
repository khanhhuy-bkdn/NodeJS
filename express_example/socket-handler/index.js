import * as tokenVerify from '../middleware/authentication'
import groupController from '../controllers/group.controller'

exports.initSocket = (http) => {
    const io = require('socket.io')(http);

    /*
    This code socket
    */
    io.use(function (socket, next) {
        const { token } = socket.handshake.query;
        try {
            tokenVerify.verifyToken(
                {
                    socket,
                    query: { token }
                },
                null,
                next);
            return next();
        } catch (e) {
            return next(e)
        }
    })

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
        socket.on('sendingTyping', async function (data) {
            console.log('Get data on event');
            console.log(data);
            socket.broadcast.emit('sendingTyping', data);
        });
        socket.on('creatingGroup', async function (data, callback) {
            console.log(data);
            try {
                const group = await groupController.addGroup(
                    {
                        user: socket.user,
                        body: data
                    });
                return callback(null);
            } catch (e) {
                if (callback) {
                    return callback(e);
                }
            }
        });
    });
}