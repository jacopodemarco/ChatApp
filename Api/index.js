const express = require('express');
require('dotenv').config()
const app = express();
const port = 8080;
const cors = require("cors");
const https = require('https');
var httpsServer = https.createServer(app)
var ObjectId = require('mongoose').Types.ObjectId; 
var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
const socketIO = require("socket.io")(httpsServer, {
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
		socket.join(name);
    const newGroup = new Groups({
      name: name,
      members: [socket.id],
    })
    newGroup.save().then((newGroup)=>{
      rooms.unshift({ _id: newGroup._id.toString() , name, messages: [] });
      console.log(rooms);
    }).catch((err)=>{
        console.log(err);
    })
		socket.emit("roomsList", rooms);
	});

	socket.on("findRoom", (id) => {
		let result = rooms.filter((messages) => messages.room == id);
		socket.emit("foundRoom", result);
		// console.log("Messages Form", result[0].messages);
	});

	socket.on("newMessage", (data) => {
		const { room_id, message, user, timestamp } = data;
		let result = messages.filter((messages) => messages.room == room_id);
		const newMessage = new Messages({
			username: user,
      payload: message,
      room: new ObjectId (room_id),
    })
    newMessage.save().then(()=>{
  }).catch((err)=>{
      console.log(err);
  })
		console.log("New Message", newMessage);
    console.log(result);
		socket.to(room_id).emit("roomMessage", newMessage);
		result.push(newMessage);
		socket.emit("roomsList", rooms);
		socket.emit("foundRoom", result);
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
  console.log(query);

  let messages = await Messages.find({room: query})
  .then((result) =>{res.json(result);})
  .catch((err)=>{console.log(err)})
  

});
  httpsServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })