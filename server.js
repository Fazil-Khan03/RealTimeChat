const express = require('express')
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
const Filter = require("bad-words")
const app = express()


const server = http.createServer(app);
const io = socketio(server)
let count = 0
io.on('connection',(socket)=>{

    socket.emit("message",'Welcome the the Chat APP')

    socket.broadcast.emit("message","A new user has joined the room") 

    socket.on('messagefromclient',(message,callback)=>{
         
        const filter = new Filter()
        if(filter.isProfane(message)){
              return callback("Profanity is now allowed")
        }
        io.emit('message',message)
        callback()

    })

   socket.on('sendLocation',(geoData,callback)=>{
       io.emit('message',`https://google.com/maps?q=${geoData.lat},${geoData.long}`);
       callback()

      
   })


    socket.on("disconnect",()=>{
         io.emit("message",'A user has left the room')

    })
    
})



const PORT = process.env.PORT || 4002
app.use(express.static('public'))

server.listen(PORT,()=>{
    console.log(`App is listening on the port ${PORT}`);
})