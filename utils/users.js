//A file related to users actions of joining or leaving or getting into the room

const users = [];

//Join user to chat
function userJoin(id, username, room ){
    const user = {id, username, room};
    users.push(user);         //push the new user into the array
    return user;
}

//get current user
function getCurrentUser(id,room){
    return users.find(user => user.id === id);
}

//user leaves the chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0]; //index is important to return the user
    }
}

//get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};