const express = require('express');
const cors = require('cors');


const app = express();
const http = require('http').createServer(app)
const PORT = process.env.PORT || 3000
// const SOCKET_PORT = 8081

http.listen(PORT, ()=>{
    console.log(`Port is running on ${PORT}`)
})


const userRouter = require("./routes/userRouter.js");


const io = require("socket.io")(http, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});


const rooms = {}
const users = {};

app.use(cors())

app.use(express.json());
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('static'))
app.use(express.urlencoded({extended:true}))



app.get("/",(req,res)=>{
  res.render('index',{});
})

app.get("/login",(req,res)=>{
res.render('login',{});
})

app.post("/login",(req,res)=>{


  res.render('login',{});
})




app.get("/register",(req,res)=>{
res.render('register',{});
})





app.get('/create-room', (req, res) => {
    // rooms[req.body.room] = { users: {} }
    // console.log(rooms)
    res.render('create-room', { rooms: rooms });
  });
  
  app.post('/create-room', (req, res) => {
    // console.log(req.body.room)
    if (rooms[req.body.room] != null || req.body.room == "") {
      return res.redirect('/create-room')
    }
    //fill romm object with posted room name as property and put empty object containing users empty object
    rooms[req.body.room] = { users: {} }
    //run an socket event to emit room name
    io.emit('room-created', req.body.room)
    //render room object
    res.render('create-room', { rooms: rooms });
  });
  
  app.get('/:room', (req, res) => {
    //join a room link
    if (rooms[req.params.room] == null) {
      //if room object is empty back to create new room
      return res.redirect('/create-room')
    }
    //render chat page with clicked room
    res.render('room', { roomName: req.params.room })
  })
  
  io.on('connection', socket => {
    socket.on('new-user', (room, name) => {
      socket.join(room)
      rooms[room].users[socket.id] = name
      socket.to(room).emit('user-connected', name)
    })
    socket.on('send-chat-message', (room, message) => {
      socket.to(room).emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
    })
    socket.on('disconnect', () => {
      getUserRooms(socket).forEach(room => {
        socket.to(room).emit('user-disconnected', rooms[room].users[socket.id])
        delete rooms[room].users[socket.id]
      })
    })
  

  })
  
  function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
      if (room.users[socket.id] != null) names.push(name)
      return names
    }, [])
  }


  //api
  app.use("/api/users",userRouter)
  app.post('/api/rooms/create-room', (req, res) => {
    // console.log(req.body.room)
    if (rooms[req.body.room] != null || req.body.room == "") {
        return res.status(200).send({ status:false, room_name: req.body.room });
    }
    //fill romm object with posted room name as property and put empty object containing users empty object
    rooms[req.body.room] = { users: {} }
    //run an socket event to emit room name
    io.emit('room-created', req.body.room)
    //render room object
    return res.status(200).send({ status:true, room_name: req.body.room });
  });

  app.get('/api/rooms/get-rooms', (req, res) => {
   
// console.log(Object.entries(users));
    return res.status(200).send({ status:true, rooms: [rooms] });
  });

