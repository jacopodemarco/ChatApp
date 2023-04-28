const express = require('express');
const app = express();
const port = 8080;
const cors = require("cors");
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cookieSession = require("cookie-session");
const dbConfig = require('./config/db.config');
const db = require("./models");
const Messages = db.messages;
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
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
 
io.on('connection', (socket) => {
  console.log(socket.id);
 
  socket.on('join', ({ name, room_id, user_id }) => {
     
      socket.join(room_id);
      if (error) {
          console.log('join error', error)
      } else {
          console.log('join user', user)
      }
  })
  socket.on('sendMessage', (message, room_id, callback) => {
     // const user = getUser(socket.id);
      const msgToStore = {
          name: user.name,
          user_id: user.user_id,
          room_id,
          text: message
      }
      console.log('message', msgToStore)
      const msg = new Messages(msgToStore);
      msg.save().then(result => {
          io.to(room_id).emit('message', result);
          callback()
      })

  })
  socket.on('get-messages-history', room_id => {
      Messages.find({ room_id }).then(result => {
          socket.emit('output-messages', result)
      })
  })
  socket.on('disconnect', () => {
      console.log("User disconnetted");
  })
});

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.sendFile('public/index.html' , { root : __dirname});
  });
  
  http.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })