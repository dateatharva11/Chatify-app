//get the form from the chat.html i.e the message send
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');


//get username and room from URL with the help of query selector cdn in chat.html file
const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true  //ignores unnecessary ? or = signs in the query
});

const socket = io() //server.js

//join chatroom and catch this command in the server
socket.emit('joinRoom',{username,room});

//get room and users
socket.on('roomUsers',({room , users})=>{
    //both thest functions crated at the bottom
    outputRoomName(room);
    outputUsers(users);
});

//message from server
socket.on('message', message =>{
    //console.log(message);
    outputMessage(message); 

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//adding event listener => message is been submitted
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault(); //prevent the form to get submit to a file and instead perform this event

    const msg = e.target.elements.msg.value; //get the message
    //console.log(msg);

    //emit the message to server and catch it in the file server.js
    socket.emit('chatMessage',msg);

    //clear input field 
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//add users to DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
