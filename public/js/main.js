// Dom Elements
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const usersList = document.querySelector('#users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Init Socket IO
const socket = io();

// Join Room
socket.emit('joinRoom', { username, room });

// Room users from server
socket.on('roomUsers', (info) => {
    // room and users info
    console.log(info);
    const { room, users } = info;
    // Render room name
    roomName.innerHTML = room;
    // Loop all users in room
    usersList.innerHTML = '';
    users.map((user) => {
        const userComponent = document.createElement('li');
        userComponent.textContent = `${user.username}`;
        usersList.appendChild(userComponent);
    });
});

// Message from server
socket.on('message', (message) => {
    // Render Message Component
    renderMessage(message);

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Submit message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message
    const msg = e.target.elements.msg.value;

    // Emit message as ChatMessage to server
    socket.emit('chatMessage', msg);

    // Clear message input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Render message element in DOM
const renderMessage = (message) => {
    // Create div element
    const messageComponent = document.createElement('div');
    messageComponent.className = 'message';
    messageComponent.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    // Render in DOM
    chatMessages.appendChild(messageComponent);
};