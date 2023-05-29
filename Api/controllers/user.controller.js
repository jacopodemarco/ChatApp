const db = require("../models");
const Groups = require("../models/groups.model");
const Messages = db.messages;
var ObjectId = require('mongoose').Types.ObjectId; 

exports.viewall = (req,res) => {
    Messages.find().then(foundMessages=>{
      res.status(200).send(foundMessages);
    }).catch((err)=>{
        console.log(err)
      })

}
exports.getMessagesByRoom = async (req,res) => {
  let query = new ObjectId(req.query.room);
      
  let messages = await Messages.find({room: query})
  .then((result) =>{res.json(result);})
  .catch((err)=>{console.log(err)})
  

}

exports.getRooms = async(req,res) => {
  let groups = await Groups.find()
  .then((result) =>{res.json(result);})
  .catch((err)=>{console.log(err)})
  

}