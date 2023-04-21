const express = require('express');
const app = express();
const port = 8080;

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to chat application." });
  });
  
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })