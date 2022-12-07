const express = require('express');
const session = require('express-session');
const filestore = require("session-file-store")(session)
const path = require("path")
var multer  = require('multer')
const jwt = require('jsonwebtoken')
const db = require("./models/index.js");
// const bcrypt = require("bcrypt");
// const passport = require('passport');
// const flash = require('express-flash')


// const initializePassport = require('./passport-config')
// initializePassport(
//   passport, 
//   async (mobile)=>{
//   const db = require("./models/index.js");
//   const User = db.users
//   return await User.findOne({where : {mobile:mobile}})
// })

const cors = require('cors');
const app = express();
const http = require('http').createServer(app)
app.use(cors())

app.use(express.json());
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('static'))
app.use(express.urlencoded({extended:true}))
// app.use(flash())
// Creating session 
app.use(session({
  name: "session-id",
  secret: "dsfsdf2q34325fergraegtewge", // Secret key,
  saveUninitialized: false,
  resave: false,
  store: new filestore()
}))

// app.use(passport.initialize())
// app.use(passport.session())

const PORT = process.env.PORT || 3000
// const SOCKET_PORT = 8081

http.listen(PORT, ()=>{
    console.log(`Port is running on ${PORT}`)
})

const userRouter = require("./routes/userRouter.js");
const roomRouter = require("./routes/roomRouter.js");
const postRouter = require("./routes/postRouter.js");
const friendRouter = require("./routes/friendRouter.js");
const mediaRouterApi = require("./routes/mediaRouterApi.js");
const followRouter = require("./routes/followRouter.js");


const roomController = require("./controllers/roomController.js");


const io = require("socket.io")(http, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});



// function uuidv4(any="") {
//   return any+"_"+Date.now()+"_"+Math.random()
// }
// console.log(uuidv4(1))
app.get("/",(req,res)=>{
  if (!req.session.token) {
    res.redirect("/login")
    res.end();
    return;
  }
  res.render('index',{});
})


//website login
app.get("/login",(req,res)=>{
  if (req.session.token) {
    const msg = `<script>location.href="/";</script>`;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(msg);
    res.end();
    return;
  }
  res.render('login',{});
})
//logic on post
app.post("/login",(req,res)=>{
  if (req.session.token) {
    const msg = `<script>location.href="/";</script>`;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(msg);
    res.end();
    return;
  }
  // console.log(req.body)
  const db = require("./models/index.js");
  const User = db.users
  const login = async ()=>{
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
            
            req.session.token = token
            // console.log(req.session.token)
            //create response object
            var msg = `<b class='text-success'>Login success</b>`;
            msg += `<script>location.href="/";</script>`;
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
app.get("/logout",(req,res)=>{
  req.session.destroy();
  res.redirect("/login")
  res.end();
  return;
})
app.get("/signout",(req,res)=>{
  req.session.destroy();
  res.redirect("/login")
  res.end();
  return;
})
//website signup
app.get("/register",(req,res)=>{
  if (req.session.token) {
    res.redirect("/")
    res.end();
    return;
  }
  res.render('register',{});
})
//all members
app.get("/all-members", async (req,res)=>{
  if (!req.session.token) {
    res.redirect("/")
    res.end();
    return;
  }
  const User = db.users;
  const allUsers = await User.findAll({})
  res.render('pages/all-members',{allUsers: allUsers});
})
//edit memeber by id
app.get("/all-members/edit/:id", async (req,res)=>{
  if (!req.session.token) {
    res.redirect("/")
    res.end();
    return;
  }
  if (!req.params.id) {
    res.redirect("/all-members");
  }
  const userid = req.params.id;
  const User = db.users;
  const singleUser = await User.findOne({ where: {id: userid} })
  if (!singleUser) {
    res.redirect("/all-members");
  }
  res.render('pages/edit-member',{singleUser: singleUser});
})
app.post("/all-members/edit/update-user-ajax", async (req,res)=>{
  if (!req.session.token) {
    const msg = `<script>location.href="/logout";</script>`;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(msg);
    res.end();
    return;
  }
  let mobile = null;
  const User = db.users;
        if (!req.body.mobile) {
          const msg = "Empty mobile number is not allowed";
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(msg);
          res.end();
          return;
        }
        
        let is_admin = false
        if (req.body.is_admin) {
          is_admin = true
        }
        if (!req.body.id) {
          console.log(req.body)
          const msg = "User id required";
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(msg);
          res.end();
          return;
        }
        if (!req.body.first_name) {
          const msg = "First name required";
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(msg);
          res.end();
          return;
        }
        if (!req.body.last_name) {
          const msg = "Last name required";
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(msg);
          res.end();
          return;
        }
        let bio = "";
        if (req.body.bio) {
          bio = req.body.bio;
        }
        if (!req.body.dob) {
          const msg = "Set Date of birth";
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(msg);
          res.end();
          return;
        }
     
        let userExist = await User.findOne({where : {id:req.body.id}})
        let userMobile = await User.findOne({where : {mobile:req.body.mobile}})
        if (!userMobile) {
          mobile = req.body.mobile
        }
        else if (userMobile && userMobile.id==userExist.id) {
          mobile = userExist.mobile
        }
        // else if (userMobile && userMobile.id!=userExist.id) {
        //   mobile = userExist.mobile
        // }
        else if (userMobile && userMobile.id!=userExist.id) {
          const msg = "Mobile number already in databse";
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(msg);
            res.end();
            return;
        }
        
        if (!userExist) {
            const msg = "User not found";
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(msg);
            res.end();
            return;
        }else{
          const updateData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            dob: req.body.dob,
            bio: bio,
            mobile: mobile,
            is_admin: is_admin
          }
          try {
            const user = await User.update(updateData, { where : {id: req.body.id} })
            if (user) {
              var msg = "Updated";
              msg += `<script>location.reload();</script>`;
              res.writeHead(200, {'Content-Type': 'text/html'});
              res.write(msg);
              res.end();
              return;
            }else{
              const msg = "User Not updated";
              res.writeHead(200, {'Content-Type': 'text/html'});
              res.write(msg);
              res.end();
              return;
            }
          } catch (error) {
            
              const msg = "Something went wrong";
              res.writeHead(200, {'Content-Type': 'text/html'});
              res.write(msg);
              res.end();
              return;
            
          }
            
        }

})

//all posts
app.get("/all-posts", async (req,res)=>{
  if (!req.session.token) {
    res.redirect("/")
    res.end();
    return;
  }
  const Post = db.posts;
  const allPosts = await Post.findAll({})
  res.render('pages/all-posts',{allPosts: allPosts});
})
//edit post by id
app.get("/all-posts/remove/:id", async (req,res)=>{
  if (!req.session.token) {
    res.redirect("/")
    res.end();
    return;
  }
  if (!req.params.id) {
    res.redirect("/all-posts");
  }
  const postid = req.params.id;
  const Post = db.posts;
  const singlePost = await Post.findOne({ where: {id: postid} })
  if (singlePost) {
    try {
      var fs = require('fs');
      var filePathToUnlink = __dirname+`/static/media/posts/${singlePost.image}`; 
      fs.unlinkSync(filePathToUnlink);
    } catch (error) {
      console.log('there was an error:', error.message);
    }
    await Post.destroy({ where: {id: postid} })
  }
  res.redirect("/all-posts");
})
//comments by post id
app.get("/all-posts/comments/:postid", async (req,res)=>{
  if (!req.session.token) {
    res.redirect("/")
    res.end();
    return;
  }
  if (!req.params.postid) {
    res.redirect("/all-posts");
  }
  const postid = req.params.postid;
  const Post = db.posts;
  const singlePost = await Post.findOne({ where: {id: postid} })
  if (singlePost) {
    try {
      typeof(singlePost.comments)=="string"?singlePost.comments=JSON.parse(singlePost.comments):""
      let comments = singlePost.comments;
      res.render('pages/all-comments-by-post',{allComments:comments,postid:postid});
      return;
    } catch (error) {
      console.log('there was an error:', error.message);
      res.redirect("/all-posts");
      return;
    }
  }
  res.redirect("/all-posts");
})
//comments by post id
app.get("/all-posts/comments/remove/:postid/:commentid", async (req,res)=>{
  if (!req.session.token) {
    res.redirect("/")
    res.end();
    return;
  }
  if (!req.params.postid || !req.params.commentid) {
    res.redirect("back")
    return;
  }
const postid = req.params.postid;
const commentid = req.params.commentid;
const Post = db.posts

// console.log("This is post: "+ postid)
if (postid) {
    try {
        let post = await Post.findOne({where : {id:postid}})
        if (!post) {
          res.redirect("back")
        }
        typeof(post.comments)=="string"?post.comments=JSON.parse(post.comments):""
        let allCmts = post.comments
        
        // let commented_by;
        // try {
        //     commented_by = search("comment_id",commentid).userid;
        // } catch (error) {
        //     commented_by = 0;
        // }
        
        let removeCmt = async function(arr, attr, value){
            var i = arr.length;
            if (i==0) {
                console.log(i+" arr length ")
                return false;
            }
            while(i--){
              console.log(arr[i][attr],value)
               if( arr[i] 
                   && arr[i].hasOwnProperty(attr) 
                   && (arguments.length > 2 && arr[i][attr] === value ) ){ 
                   arr.splice(i,1);
                   return true;
               }
            }
            return false;
            
        }
      
        if(await removeCmt(allCmts,'comment_id',commentid)){
            await Post.update({comments:allCmts}, {where : {id:postid}})
            res.redirect("back");
            return;
        }else{
            res.redirect("back");
            return;
        }
        
    } catch (error) {
      res.redirect("back");
      return;
    }
}
res.redirect("back");
return;
})
//todays members
app.get("/todays-members",(req,res)=>{
  if (!req.session.token) {
    res.redirect("/")
    res.end();
    return;
  }
  res.render('pages/todays-members',{});
})

const mediaRouter = require("./routes/mediaRouter.js");
app.use("/gallery",mediaRouter);

//website signup
app.get("/register",(req,res)=>{
  res.render('register',{});
})
app.post("/register",(req,res)=>{
  if (req.session.token) {
        const msg = `<script>location.href="/";</script>`;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(msg);
        res.end();
        return;
      }
  // console.log(req.body)
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
          var msg = "";
          const token = jwt.sign({userId: user.id},
            process.env.JWT_SECRET_KEY, {expiresIn: "5d"}
            )
            try {
              req.session.token = token
              await User.update({token: token}, {where : {mobile:user.mobile}})
              msg = `<script>location.href="/";</script>`;
              msg += "Registration success";
            } catch (error) {
              msg += "Registration not success";
            }
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
const rooms = { }
// const users = { }
const roomsApi = [];
app.get('/rooms', async (req, res) => {
  const db = require("./models/index.js");
  const Room = db.rooms
  let allRooms = await Room.findAll({})
      // for (const rm of allRooms) {
      //   if (rooms[rm.room_name]==undefined || rooms[rm.room_name]==null) {
      //     rooms[rm.room_name] = { users: { } }
      //     io.emit('room-created', rm.room_name)
      //   }
      // }
      
      res.render('create-room', { roomsObj: allRooms });
  
    
  });
  
  app.post('/rooms', async (req, res) => {
    if (!req.session.token) {
      const msg = `<script>location.href="/";</script>`;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(msg);
      res.end();
      return;
    }
    const db = require("./models/index.js");
    const Room = db.rooms
    const User = db.users
    let singleRoom = await Room.findOne({where: {room_name: req.body.room}})
    if (singleRoom) {
      return res.redirect('/rooms')
    }
    let roomAdmin = await User.findOne({where : {token:req.session.token}})
      // let roomExist = await Room.findOne({where : {room_name:valiRooName}})
      // let userHasAlreadyRoomCreated = await Room.findOne({where : {created_by:roomAdmin.id}})
    await Room.create({
      room_name: req.body.room, 
      users: [roomAdmin.id], 
      created_by: roomAdmin.id
    })
    // let  roomsObj = await User.findAll({})
    // res.render('create-room', { roomsObj: roomsObj });
    return res.redirect('/rooms');
  });
  
  app.get("/chat-v2/:roomid", async (req, res) => {
    if (!req.session.token) {
      const msg = `<script>location.href="/";</script>`;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(msg);
      res.end();
      return;
    }
    const db = require("./models/index.js");
    const Room = db.rooms
    const User = db.users
    let singleRoom = await Room.findOne({where: {id: req.params['roomid']}})
    let member = await User.findOne({where : {token:req.session.token}})
    
    if (!singleRoom) {
      return res.redirect('/rooms')
    }
    typeof(singleRoom.users)=="string"?singleRoom.users=JSON.parse(singleRoom.users):""

    const search_mmbr =  (vl,myArray)=>{
      for (let i=0; i < myArray.length; i++) {
          if (myArray[i] === vl) {
              return true;
          }
      }
      return false;
    }
    if(!search_mmbr(member.id,singleRoom.users)){
      singleRoom.users.push(member.id);
      await Room.update({users: singleRoom.users}, {where : {id: singleRoom.id}})
    }
    let chatRoom = await Room.findOne({where: {id: req.params['roomid']}})
    const roomadmin = await User.findOne({where : {id:chatRoom.created_by}})
    if (!roomadmin) {
      const msg = `<script>alert('Room admin not exist');location.href="/";</script>`;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(msg);
      res.end();
      return;
    }
    const roomDetail = {
      id: chatRoom.id,
      room_name: chatRoom.room_name,
      image: chatRoom.image,
      created_by: chatRoom.created_by,
      first_name: roomadmin.first_name,
      last_name: roomadmin.last_name,
      creator_image: roomadmin.image
    }


    typeof(chatRoom.users)=="string"?chatRoom.users=JSON.parse(chatRoom.users):""
    let chatMembers = [];
    for (const usr of chatRoom.users) {
      let member = await User.findOne({where : {id:usr}})
      chatMembers.push({
        room_id: chatRoom.id,
        user_id: member.id,
        first_name: member.first_name,
        last_name: member.last_name,
        image: member.image
      })
    }
    
    
    res.render('chat-page', { chatRoom: roomDetail, chatMembers: chatMembers, sender: member })
  })


  
//old
  app.get("/chat/:room", async (req, res) => {
    console.log(rooms," all rooms")

    const db = require("./models/index.js");
    const Room = db.rooms
    let singleRoom = await Room.findOne({where: {room_name: req.params['room']}})
    // console.log(singleRoom.room_name, "single")
    // console.log(rooms, "Roomsvh j")
    if (!singleRoom) {
      return res.redirect('/rooms')
    }
    // console.log(rooms)
    if (rooms[singleRoom.room_name] == undefined || !rooms[singleRoom.room_name]) {
      return res.redirect('/rooms')
    }
    // render chat page with clicked room
    res.render('room', { roomName: req.params['room'] })
  })

  

  
  io.on('connection', socket => {

    try {
      socket.on('new-user', (room, name) => {
        socket.join(room)
        // console.log(rooms)
        // console.log(name)
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

    socket.on('room-message', (msg) => {
      socket.emit('chat-message', { 
        roomid: msg.room_id,
        message: msg.message
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
  app.use("/api/friends",friendRouter);
  app.use("/api/gallery",mediaRouterApi);
  app.use("/api/followers",followRouter);
  //old
  app.post("/api/rooms/add-room",(req,res)=>{
    const db = require("./models/index.js");
    const Room = db.rooms
    const User = db.users
      const addRoom = async ()=>{
        const valiRooName = (req.body.room_name).replaceAll(" ","").replaceAll("^","").replaceAll("/","").replaceAll(",","").replaceAll("'","").replaceAll('"',"").replaceAll('`',"").replaceAll("\/","").replaceAll("\\","").replaceAll("&","").replaceAll("?","").replaceAll("=","").replaceAll("%","").replaceAll(".","").replaceAll("-","").replaceAll("*","");
        if (valiRooName=="" || valiRooName== undefined) {
          const data = {status:false,msg:"Invalid name",data:null}
          res.status(200).json(data)
          return;
        }
        const roomAdminId =  req.body.created_by;
        // console.log(roomAdminId)
        let roomAdmin = await User.findOne({where : {id:roomAdminId}})
        
        // console.log(roomAdmin)
        let roomExist = await Room.findOne({where : {room_name:valiRooName}})
        let userHasAlreadyRoomCreated = await Room.findOne({where : {created_by:req.body.created_by}})

       
        
        if (roomExist) {
            const data = {status:false,msg:"This room is already registered",data:null}
            res.status(200).json(data)
            return;
        }else{
          if (roomAdmin.is_admin==false && userHasAlreadyRoomCreated) {
            // console.log(userHasAlreadyRoomCreated.room_name+" Already")
            // console.log(roomAdmin.is_admin+" is Admin")
            const data = {status:false,msg:"You can create only one room",data:userHasAlreadyRoomCreated}
            if (rooms[userHasAlreadyRoomCreated.room_name]==undefined || rooms[userHasAlreadyRoomCreated.room_name]=="" || rooms[userHasAlreadyRoomCreated.room_name]==null) {
              rooms[userHasAlreadyRoomCreated.room_name] = { users: {} }
            }
            res.status(200).json(data)
            return;
          }
            const room = await Room.create({
                room_name : valiRooName,
                created_by : req.body.created_by,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                creator_image: req.body.creator_image,
                users : req.body.users,
                image : req.body.image,
                info : req.body.info,
                active : true,
            });
            rooms[valiRooName] = { users: {} }
            const data = {status:true,msg:"Room Created",data:room}
            res.status(200).json(data)
        }
    }
    addRoom()
  })
  

  app.post("/api/rooms/add-room-v2",(req,res)=>{
    const db = require("./models/index.js");
    const Room = db.rooms
    const User = db.users
      const addRoom = async ()=>{
        
        const db = require("./models/index.js");
        const Room = db.rooms
        const User = db.users
        
        let roomAdmin = await User.findOne({where : {token:req.body.token}})
        if (!roomAdmin) {
          const data = {status:false,msg:"Invalid token",data:null}
          res.status(200).json(data)
          return;
        }
          let roomExist = await Room.findOne({where : {room_name:req.body.room_name}})
          if (roomExist) {
            let chatRoom = roomExist;
            const roomDetail = {
              id: chatRoom.id,
              room_name: chatRoom.room_name,
              users: chatRoom.users, 
              image: chatRoom.image,
              created_by: chatRoom.created_by,
              first_name: roomAdmin.first_name,
              last_name: roomAdmin.last_name,
              creator_image: roomAdmin.image
            }
            const data = {status:false,msg:"This room is already registered",data:roomDetail}
            res.status(200).json(data)
            return;
        }
        let userHasAlreadyRoomCreated = await Room.findOne({where : {created_by:roomAdmin.id}})
        if (userHasAlreadyRoomCreated) {
          const data = {status:false,msg:"You can create only one room",data:userHasAlreadyRoomCreated}
          res.status(200).json(data)
          return;
        }
        const chatRoom = await Room.create({
          room_name: req.body.room_name, 
          users: [roomAdmin.id], 
          created_by: roomAdmin.id
        })

        // let  roomsObj = await User.findAll({})

        const roomDetail = {
          id: chatRoom.id,
          room_name: chatRoom.room_name,
          users: chatRoom.users, 
          image: chatRoom.image,
          created_by: chatRoom.created_by,
          first_name: roomAdmin.first_name,
          last_name: roomAdmin.last_name,
          creator_image: roomAdmin.image
        }
        const data = {status:true,msg:"Room Created",data:roomDetail}
        res.status(200).json(data)
    }
    addRoom()
  })


  app.get("/api/rooms/get/:id",(req,res)=>{
    const db = require("./models/index.js");
    const Room = db.rooms
      const getRoom = async ()=>{
        let id = req.params.id
        if (id) {
            let room = await Room.findOne({where : {id:id}})
            if (room) {
                //create response object
                const data = {status:true,msg:"Room found",data:room}
                //json data after success sign in
                res.status(200).json(data)
            }else{
                //json data after failed sign in
                const data = {status:false,msg:"room not found",data:null}
                res.status(200).json(data)
            }
            
        }else{
            res.status(200).json("All fields are mandetory")
        }
    }
    getRoom()
  })
  


  app.get("/api/rooms/get-v2/:roomid",(req,res)=>{
    const db = require("./models/index.js");
    const Room = db.rooms
    const User = db.users
      const getRoom = async ()=>{
        let id = req.params.roomid
        if (id) {
            let chatRoom = await Room.findOne({where : {id:id}})
            if (chatRoom) {
  const roomadmin = await User.findOne({where : {id:chatRoom.created_by}})
  if (!roomadmin) {
    const data = {status:false,msg:"Room admin not found",data:null}
                //json data after success sign in
    res.status(200).json(data)
    return;
  }



  typeof(chatRoom.users)=="string"?chatRoom.users=JSON.parse(chatRoom.users):""
  let chatMembers = [];
  // for (const usr of chatRoom.users) {
  //   let member = await User.findOne({where : {id:usr}})
  //   chatMembers.push({
  //     room_id: chatRoom.id,
  //     user_id: member.id,
  //     first_name: member.first_name,
  //     last_name: member.last_name,
  //     image: member.image
  //   })
  // }
  const roomDetail = {
    id: chatRoom.id,
    room_name: chatRoom.room_name,
    users: null,
    image: chatRoom.image,
    created_by: chatRoom.created_by,
    first_name: roomadmin.first_name,
    last_name: roomadmin.last_name,
    creator_image: roomadmin.image
  }
  
          // const myData = { chatRoom: roomDetail }
                const data = {status:true,msg:"Room found",data:roomDetail}
                //json data after success sign in
                res.status(200).json(data)
            }else{
                //json data after failed sign in
                const data = {status:false,msg:"room not found",data:null}
                res.status(200).json(data)
            }
            
        }else{
            res.status(200).json("All fields are mandetory")
        }
    }
    getRoom()
  })

//chatting 
  app.post("/api/rooms/chat", async (req,res)=>{
   
    if (!req.body.token || !req.body.roomid || !req.body.message) {
      const data = {status:false,msg:"Missing required field",data:null}
      res.status(200).json(data)
      return;
    }
    const db = require("./models/index.js");
    const Room = db.rooms
    const User = db.users
    const Chat = db.chats
    const roomid = req.body.roomid
    const token = req.body.token

    let loggedin = await User.findOne({where : {token:token}})
        if (!loggedin) {
          const data = {status:false,msg:"Invalid token",data:null}
          res.status(200).json(data)
          return;
      }

    const senderid  = loggedin.id
    
    const message = req.body.message

   

  const getRoom = async ()=>{
      if (roomid) {
        let chatRoom = await Room.findOne({where : {id:roomid}})
          if (chatRoom) {
              const roomadmin = await User.findOne({where : {id:chatRoom.created_by}})
              if (!roomadmin) {
                const data = {status:false,msg:"Room admin not found",data:null}
                res.status(200).json(data)
                return;
              }
              typeof(chatRoom.users)=="string"?chatRoom.users=JSON.parse(chatRoom.users):""

              const search_sndr =  (vl,myArray)=>{
                for (let i=0; i < myArray.length; i++) {
                    if (myArray[i] === vl) {
                        return true;
                    }
                }
                return false;
              }
              if(!search_sndr(senderid,chatRoom.users)){
                chatRoom.users.push(senderid);
                await Room.update({users: chatRoom.users}, {where : {id: chatRoom.id}})
              }

              try {
                const sender = await User.findOne({where : {id:senderid}})
                const msg = await Chat.create({
                  sender_id: senderid,
                  room_id: roomid,
                  message: message
                })
                const responseData = {
                  sender_id :msg.sender_id,
                  first_name : sender.first_name,
                  last_name : sender.last_name,
                  sender_image : sender.image,
                  room_id :msg.room_id,
                  message :msg.message,
                  date :msg.createdAt
                }
                io.emit('room-message', responseData)
                const data = {status:true,msg:"message sent",data:responseData}
                res.status(200).json(data)
              } catch (error) {
                const data = {status:false,msg:"message not sent",data:null}
                res.status(200).json(data)
              }
              
          }
          else{
            const data = {status:false,msg:"room not found",data:null}
            res.status(200).json(data)
          }
        }else{
          const data = {status:false,msg:"room id is invalid",data:null}
          res.status(200).json(data)
        }
      }
    getRoom()
  })















  app.delete("/api/rooms/delete/:id",(req,res)=>{
    const db = require("./models/index.js");
    const Room = db.rooms
    const User = db.users
      const deleteRoom = async ()=>{
        let user = await User.findOne({where : {token:token}})
        if (!user) {
          const data = {status:false,msg:"Invalid token",data:null}
          res.status(200).json(data)
        }
        
        let id = req.params.id
        if (id) {
            let room = await Room.findOne({where : {id:id}})
            if (room) {
              if (user.is_admin==1) {
                await Room.destroy({where : {id:req.body.room_id}})
                // delete rooms.room.room_name
                const data = {status:true,msg:"Room deleted",data:null}
                res.status(200).json(data)
              }
              if (user.is_admin!=1 && room.created_by==user.id) {
                await Room.destroy({where : {id:req.body.id}})
                const data = {status:true,msg:"Room deleted",data:null}
                res.status(200).json(data)
              }else{
                const data = {status:false,msg:"You have not created any room",data:null}
                res.status(200).json(data)
              }
                //create response object
                const data = {status:true,msg:"Room not deleted",data:room}
                res.status(200).json(data)
            }else{
                const data = {status:false,msg:"room not found",data:null}
                res.status(200).json(data)
            }
            
        }else{
            const data = {status:false,msg:"All fields are mandetory",data:null}
            res.status(200).json(data)
        }
    }
    deleteRoom()
  })

  app.get("/api/rooms/get",(req,res)=>{
    const db = require("./models/index.js");
    const Room = db.rooms
    const getAllRooms = async ()=>{
      //for all data
      let roomsApi = await Room.findAll({});
      roomsApi.forEach(item => {
        
        if (rooms[item.room_name] == null) {
          io.emit('room-created', item.room_name)
          rooms[item.room_name] = { users: {} }
        }
       
      });
      const data = {status:true,msg:"Room found",data:roomsApi}
      res.status(200).json(data)
  }
    getAllRooms()
  })
  
  app.get("/api/rooms/get-v2",(req,res)=>{
    const db = require("./models/index.js");
    const Room = db.rooms
    const User = db.users
    let allRooms = []
    const getAllRooms = async ()=>{
      //for all data
      let roomsApi = await Room.findAll({});
      for (const chatRoom of roomsApi) {
        var roomAdmin = await User.findOne({where : {id:chatRoom.created_by}});
        if (roomAdmin) {
          allRooms.push({
            id: chatRoom.id,
            room_name: chatRoom.room_name,
            users: chatRoom.users,
            image: chatRoom.image,
            created_by: chatRoom.created_by,
            first_name: roomAdmin.first_name,
            last_name: roomAdmin.last_name,
            creator_image: roomAdmin.image
          })
        }
      }
      const data = {status:true,msg:"Room found",data:allRooms}
      res.status(200).json(data)
  }
    getAllRooms()
  })

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/media/profiles')
  },
  // filename: function (req, file, cb) {
  //   cb(null, file.originalname)
  // }
  filename: function (req, file, cb) {
    var extname = path.extname(file.originalname).toLowerCase();
      cb(null, file.fieldname + "_"+ Date.now()+extname)

    }
})
var upload = multer({ storage: storage })
  
app.post('/api/users/profile-upload', upload.single('profile_image'), async (req,res)=>{
    // console.log(JSON.stringify(req.file))
    // console.log("Token: "+ req.body.token)
    const db = require("./models/index.js");
    const User = db.users
    const token = req.body.token;
    const imageName = req.file.filename;
    
    if (token) {
      let user = await User.findOne({where : {token:token}})
      if (user) {
          //create response user
          const updateUserData = {
              image: imageName?imageName:user.image
          }
          //update user if not null
          
          //json data after success sign in
          User.update(updateUserData, {where : {token:token}})
          if (user) {
            try {
              var fs = require('fs');
              var filePathToUnlink = __dirname+`/static/media/profiles/${user.image}`; 
              fs.unlinkSync(filePathToUnlink);
            } catch (error) {
              console.error('there was an error:', error.message);
            }
              const data = {status:true,msg:"Updated",data:imageName}
              res.status(200).json(data)
          }else{
            try {
              var fs = require('fs');
              var filePathToUnlink = __dirname+`/static/media/profiles/${imageName}`; 
              fs.unlinkSync(filePathToUnlink);
            } catch (error) {
              console.error('there was an error:', error.message);
            }
              const data = {status:false,msg:"Not updated",data:null}
              res.status(200).json(data)
          }
          return;
      }else{
        const data = {status:true,msg:"Invalid token",data:null}
        return res.status(200).json(data)
      }
    }
    const data = {status:true,msg:"You are not logged in",data:null}
    return res.status(200).json(data)
})

