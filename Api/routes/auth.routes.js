

module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
      });

      app.post(
        "/api/auth/signup",
       (req, res ) => {

        console.log(req.body);
        res.status(200).json({status: "success"})
       });
    

};