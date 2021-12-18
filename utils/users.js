const users = [];

// Join user to room
function joinUser(id, username, room) {
    // Create user
    const user = {
        id,
        username,
        room
    };

    // Add user to users collection
    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find((user) => user.id === id);
}

// Leave user from room
function leaveUser(id) {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(room) {
    const roomUsers = users.filter((user) => user.room === room);
    return roomUsers;
}

module.exports = {
    joinUser,
    leaveUser,
    getCurrentUser,
    getRoomUsers
};