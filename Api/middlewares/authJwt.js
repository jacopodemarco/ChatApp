const jwt = require("jsonwebtoken");
const config = require("../config/auth.config")

exports.verifyToken = (req,res,next) => {
    let token = req.session.token;
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token,config.secret,(err,decoded)=>{
      if (err){
        console.log(err);
        res.status(401).send({message: "Unauthorized!"});
      }
      req.userId = decoded.id;
      next();
     
    
    });




}