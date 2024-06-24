const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const { generateMessage, generateLocationMessage } = require("./utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom, getUserByName } = require('./utils/users');

const staticPath = path.join(__dirname, '/../Chat');
console.log(`Serving static files from: ${staticPath}`);

app.use(express.static(staticPath));

io.on('connection', (socket) => {
    console.log("user is connected");

    socket.on('join', (options, callback) => {
        console.log(options);

        // Валідація даних
        if (!options || !options.username || !options.room) {
            return callback('Username and room are required!');
        }

        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);
        socket.emit('message', generateMessage('', `Вітаю, ${user.username}, в кімнаті ${user.room}!`));
        socket.broadcast.to(user.room).emit('message', generateMessage('', `${user.username} приєднався`));
        io.to(user.room).emit('roomData', {
            users: getUsersInRoom(user.room)
        });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    });

    socket.on('userIsTyping', () => {
        const user = getUser(socket.id);
        socket.broadcast.to(user.room).emit('messageTyping', user.username);
    });

    socket.on('privateMessage', (data, callback) => {
        const recipientSocket = io.sockets.sockets.get(getUserByName(data.to).id);
        const user = getUser(socket.id);
        if (recipientSocket) {
            recipientSocket.emit('message', generateMessage(user.username, data.text));
        }
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage('', `${user.username} покинув кімнату`));
            io.to(user.room).emit('roomData', {
                users: getUsersInRoom(user.room)
            });
        }
    });
});

server.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
