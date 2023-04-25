const controller = require("../controllers/auth.controller");
const {authJwt} = require("../middlewares")
module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
      });

      app.post(
        "/api/auth/signup",controller.signup);

      app.post('/api/auth/login', controller.login);
    

};