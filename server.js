// MODULES
const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    joinUser,
    leaveUser,
    getCurrentUser,
    getRoomUsers
} = require('./utils/users');

// Init Express App & create Server
const app = express();
const server = http.createServer(app);
// Init IO in Server
const io = socketio(server);

// Set static folders
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'LearnByChat';

// Run when client connect
io.on('connection', (socket) => {
    // Run when client Join room
    socket.on('joinRoom', ({ username, room }) => {
        // Join user to its room
        const user = joinUser(socket.id, username, room);
        socket.join(user.room);

        // Emit Welcome message
        socket.emit('message', formatMessage(botName, 'Welcome to LearnByChat!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} joined the room`)
            );

        // Send room and users info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        // Current User
        const currentUser = getCurrentUser(socket.id);
        // Emit message to all clients of same room
        io.to(currentUser.room).emit(
            'message',
            formatMessage(currentUser.username, msg)
        );
    });

    // Run when client disconnects
    socket.on('disconnect', () => {
        // User to leave
        const user = leaveUser(socket.id);
        if (user) {
            // Emit message to all clients of same room
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the room`)
            );
            // Emit room and users info for all calients of room
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

// Run server on PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}...`));