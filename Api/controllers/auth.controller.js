const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    User.findOne({username: req.body.username}).then(foundUser=>{
        
        if (!foundUser) {  
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password : req.body.password
        })
        newUser.save().then(()=>{
            res.status(200).send({message: "User Succesful Registered"})
        }).catch((err)=>{
            console.log(err);
        })
      }}).catch((err)=>{
        console.log(err)
      })
 
}

exports.login = (req,res) => {
   User.findOne({username: req.body.username})
   .exec((err,user) => {
  if (err){
    console.log(err);
    res.status(500).send({message: err})
    return
  }
 
  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }
   
  var passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  );


  if (!passwordIsValid){
    console.log("Password is not Valid");
    res.status(401).send({message: "Wrong Password"});
  }

  var token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400, // 24 hours
  });

  req.session.token = token;

  res.status(200).send({Status: "Successful Login"})

   })

}

