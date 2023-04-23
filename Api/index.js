const express = require('express');
const app = express();
const port = 8080;
const cors = require("cors");
const cookieSession = require("cookie-session");
const dbConfig = require('./config/db.config');
const db = require("./models");
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
    res.json({ message: req.session});
  });
  
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })