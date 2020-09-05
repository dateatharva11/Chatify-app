//entry point & backend

const path = require('path');  //bring the current path till chatcord
const http = require('http');       
const express = require('express');                 //bring express
const socketio = require('socket.io');              //bring socket.io
const formatMessage = require('./utils/message');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

//set static folder
//public being named as the target folder to open on the browser
app.use(express.static(path.join(__dirname,'public'))); 

const botName = 'AD_Bot';

//Run when client connects
io.on('connection', function(socket){
    console.log('New Web socket connection....');
    socket.on('joinRoom',({username,room})=> {
        
        //associate room with current user who is entering into the chatroom
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //since bidirection communication should happen and welcome current user
        socket.emit('message',formatMessage(botName,'Welcome to Chatify')); 

        //broadcast when user connects  //to(user.room) => specifies the message to that specific room
        socket.broadcast
        .to(user.room)
        .emit('message',formatMessage(botName,`${user.username} has joined the chat`));

        //send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })

    })
    
    //listen for the chatMessage
    socket.on('chatMessage', (msg) =>{
        const user = getCurrentUser(socket.id);

        //console.log(msg);
        //emit the message to everybody
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });
    
    //runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));

            //send users and room info
            io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
        }
    });
});

const PORT = process.env.port || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
