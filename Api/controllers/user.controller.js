const db = require("../models");
const Messages = db.messages;

exports.viewall = (req,res) => {
    Messages.find().then(foundMessages=>{
     console.log (foundMessages);
    }).catch((err)=>{
        console.log(err)
      })
    
    res.status(200).send({message: "ecco tutti"})
    

}