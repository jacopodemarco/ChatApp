const authJwt = require('../middlewares');
const controller = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/authJwt');
module.exports = function (app){
  
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
      });
        
        app.get("/rooms", verifyToken, controller.getRooms);

      app.get("/messages", verifyToken, controller.getMessagesByRoom);
      
      app.get(
        "/messages/all",verifyToken,controller.viewall);


}