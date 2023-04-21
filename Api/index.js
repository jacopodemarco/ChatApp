const express = require('express');
const app = express();
const port = 8080;
const cors = require("cors");
const cookieSession = require("cookie-session");
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
    httpOnly: true
  })
);

require('./routes/auth.routes')(app);

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to chat application." });
  });
  
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })