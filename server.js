const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app)
app.use(cors())

app.use(express.json());
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('static'))
app.use(express.urlencoded({extended:true}))

const PORT = process.env.PORT || 3000
// const SOCKET_PORT = 8081

http.listen(PORT, ()=>{
    console.log(`Port is running on ${PORT}`)
})

const userRouter = require("./routes/userRouter.js");
const roomRouter = require("./routes/roomRouter.js");
const postRouter = require("./routes/postRouter.js");
const roomController = require("./controllers/roomController.js");



const io = require("socket.io")(http, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

const rooms = {};
const users = {};


// app.use((req,res,next)=>{
// console.log(req)
// next()
// })




app.get("/",(req,res)=>{
  res.render('index',{});
})


//website login
app.get("/login",(req,res)=>{
res.render('login',{});
})
//logic on post
app.post("/login",(req,res)=>{
  console.log(req.body)
  const db = require("./models/index.js");
  const User = db.users
  const login = async ()=>{
    const jwt = require('jsonwebtoken')
    let mobile = req.body.mobile
    let password = req.body.password
    if (mobile && password) {
        let user = await User.findOne({where : {mobile:mobile,password:password}})
        if (user) {
            const token = jwt.sign({userId: user.id},
                process.env.JWT_SECRET_KEY, {expiresIn: "5d"}
                )
                //update token after sign in
            await User.update({token:token}, {where : {id:user.id}})
            //create response user
            // const loggedInUser = {
            //     token: token
            // }
            
            app.use(session({
              token: token
            }))
            console.log(req.session)
            //create response object
            const msg = `<b class='text-success'>Login success</b>`;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(msg);
            res.end();
            return;
        }else{
            //json data after failed sign in
            const msg = `<b class='text-danger'>Invalid creadential, login failed</b>`;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(msg);
            res.end();
            return;
        }
        
    }else{
        const msg = "All fields are mendatory";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(msg);
        res.end();
        return;
    }
}
login()
})
//website login end

//website signup
app.get("/register",(req,res)=>{
res.render('register',{});
})
//logic on post method
app.post("/register",(req,res)=>{
  const db = require("./models/index.js");
  const User = db.users
  const signUp = async ()=>{
    const signUpData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        mobile : req.body.mobile,
        password : req.body.password,
        token: null,
        active: 1
    }
    if (req.body.mobile=="") {
        const msg = "Empty mobile number is not allowed";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(msg);
        res.end();
        return;
    }
    if (req.body.password=="" || req.body.cnf_password=="") {
      const msg = "Empty Password";
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(msg);
      res.end();
      return;
    }
    if (req.body.password!=req.body.cnf_password) {
        const msg = "Password did not match";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(msg);
        res.end();
        return;
    }
    let userExist = await User.findOne({where : {mobile:req.body.mobile}})
    if (userExist) {
        const msg = "This number is already registered";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(msg);
        res.end();
        return;
    }else{
        const user = await User.create(signUpData);
        if (user) {
          const msg = "Registration success";
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(msg);
          res.end();
          return;
        }else{
          const msg = "Registration failed";
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(msg);
          res.end();
          return;
        }
        return;
    }
}
signUp()
})
//website signup end

//website signup
app.get("/register",(req,res)=>{
res.render('register',{});
})
app.post("/register",(req,res)=>{
  console.log(req.body)
  const db = require("./models/index.js");
  const User = db.users
  const signUp = async ()=>{
    const signUpData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        mobile : req.body.mobile,
        password : req.body.password,
        token: null,
        active: 1
    }
    if (req.body.mobile=="") {
        const msg = "Empty mobile number is not allowed";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(msg);
        res.end();
        return;
    }
    if (req.body.password=="" || req.body.cnf_password=="") {
      const msg = "Empty Password";
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(msg);
      res.end();
      return;
    }
    if (req.body.password!=req.body.cnf_password) {
        const msg = "Password did not match";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(msg);
        res.end();
        return;
    }
    let userExist = await User.findOne({where : {mobile:req.body.mobile}})
    if (userExist) {
        const msg = "This number is already registered";
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(msg);
        res.end();
        return;
    }else{
        const user = await User.create(signUpData);
        if (user) {
          const msg = "Registration success";
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(msg);
          res.end();
          return;
        }else{
          const msg = "Registration failed";
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(msg);
          res.end();
          return;
        }
        return;
    }
}
signUp()
})
//website signup end

const roomsApi = [];
app.get('/rooms', (req, res) => {
    let allRooms;
    const allrooms = async ()=>{
      allRooms = await roomController._getRooms();
      
      allRooms.forEach(item => {
        
        if (rooms[item.room_name] == null) {
          io.emit('room-created', item.room_name)
          rooms[item.room_name] = { users: {} }
        }
       
      });
    }
    allrooms()
      
    
    res.render('create-room', { rooms: rooms });
  });
  
  app.post('/rooms', (req, res) => {
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

    try {
      socket.on('new-user', (room, name) => {
        socket.join(room)
        console.log(name)
        rooms[room].users[socket.id] = name
        socket.to(room).emit('user-connected', name)
      })
    } catch (error) {
      console.log(error)
    }


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
  app.use("/api/users",userRouter);
  app.use("/api/rooms",roomRouter);
  app.use("/api/posts",postRouter);

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
    const data = {
      rooms: rooms,
      users: users
    }
    return res.status(200).send({ status:true, data });
  });
  
  app.get('/api/rooms/get-rooms', (req, res) => {
    const data = {
      rooms: rooms,
      users: users
    }
// console.log(Object.entries(users));
    return res.status(200).send({ status:true, data });
  });
