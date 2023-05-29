const express = require('express');
require('dotenv').config()
const app = express();
const port = 3000;
const cors = require("cors");
const http = require('http');
var httpServer = http.createServer(app)
var ObjectId = require('mongoose').Types.ObjectId; 
var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
const socketIO = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
const cookieSession = require("cookie-session");
const db = require("./models");
const Messages = db.messages;
const Groups  = db.groups;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "bezkoder-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 
  })
);

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
 
const generateID = () => Math.random().toString(36).substring(2, 10);
let rooms = [];
let messages = [];

socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("createRoom", (name) => {
		//socket.join(name);
    const newGroup = new Groups({
      name: name,
      members: [socket.id],
    })
    newGroup.save().then((newGroup)=>{
      rooms.push({ _id: newGroup._id , name, members: [socket.id] });
      console.log(rooms)
      socket.broadcast.emit("roomsList", rooms);
      socket.emit("roomsList", rooms);
    }).catch((err)=>{
        console.log(err);
    })
    
	});
	socket.on("findRoom", (id) => {
    socket.join(id)
		let result = rooms.filter((messages) => messages.room == id);
		socket.emit("foundRoom", result);
    console.log(socket.rooms);
		// console.log("Messages Form", result[0].messages);
	});

	socket.on("newMessage", async (data) => {
    console.log(socket.rooms);
		const { room_id, message, user, timestamp } = data;
		const newMessage = new Messages({
			username: user,
      payload: message,
      room: new ObjectId (room_id),
      createdAt: new Date(),
    })
    newMessage.save().then(()=>{
  }).catch((err)=>{
      console.log(err);
  })
    let result = messages.filter((messages) => messages.room == room_id);
		result.push(newMessage);
    socket.to(room_id).emit("newmsg", result);
		//socket.emit("roomsList", rooms);
   // console.log(result);
		socket.emit("newmsg", newMessage);
	});
	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("🔥: A user disconnected");
	});
});

db.mongoose
  .connect(`mongodb+srv://jacopodemarco01:${process.env.PASSWORD}@cluster0.myyquju.mongodb.net/`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log("Successfully connect to MongoDB.");
    rooms = await Groups.find();
    messages = await Messages.find()
  })
  .catch(err => {
    console.error("Connection error", err);
    console.log(process.env.USERNAME,process.env.PASSWORD)
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.sendFile('public/index.html' , { root : __dirname});
  });
  
  app.get("/api", (req, res) => {

    res.json(rooms);

});
app.get("/messages", async (req, res) => {
  let query = new ObjectId(req.query.room);

  let messages = await Messages.find({room: query})
  .then((result) =>{res.json(result);})
  .catch((err)=>{console.log(err)})
  

});
  httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })