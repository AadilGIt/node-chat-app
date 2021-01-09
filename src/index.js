const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')
const Filter = require('bad-words')
const {genrateMessages,locationMessages} = require('./utils/messages')
const  {adduser,removeuser,getuser,getuserinroom} = require('./utils/users.js')

const app = express()
const server =http.createServer(app)
const io = socket(server)

const port = process.env.PORT || 3000
const public = path.join(__dirname,'../public')


app.use(express.static(public))


// let count = 0
io.on('connection', (socket) => {
    console.log('connection started')

socket.on('join',({username,room},callback) => {
    const { error,user} = adduser({ id:socket.id,username,room})

    if(error) {
        return callback(error)
    }

    socket.join(user.room)

    socket.emit('message',genrateMessages('Admin', 'welcome'))
    socket.broadcast.to(user.room).emit('message',genrateMessages('Admin', `${user.username} has joined!`))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getuserinroom(user.room)
    })
    callback()
    
})
    
    socket.on('increment',(message,callback) => {
        // count++
        const user = getuser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('profanity is not allowed')
        }
        io.to(user.room).emit('message',genrateMessages(user.username,message))
        callback()
    })

    socket.on('location', (coords,location) =>{
        const user = getuser(socket.id)
        io.to(user.room).emit('sendLoca',locationMessages(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        location()
    })
    socket.on('disconnect',() => {
        const user = removeuser(socket.id)

        if(user){
        io.to(user.room).emit('message',genrateMessages('Admin', `${user.username} has left the chat`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getuserinroom(user.room)
        })
    }
        
        console.log('got disconnected')
    })
})
server.listen(port, () => {
    console.log('server runing on port', port)
})