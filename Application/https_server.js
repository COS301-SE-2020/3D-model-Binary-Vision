
//variables needed
var express = require('express'),
    app = express(),
    port =process.env.PORT || 443,
    mongoose =require('mongoose'),
    bodyParser = require('body-parser'),
    serveStatic= require('serve-static');

const https = require('https');
const fs = require('fs');

var MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

//mongoose instance connection url connection
// mongoose.Promise = global.Promise;


mongoose.connect('mongodb://localhost/ModelDB', MONGO_OPTIONS);
mongoose.set('useFindAndModify',false);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const cookieparser = require("cookie-parser")
app.use(cookieparser());

app.use((req, res, next) => {
  // console.log(req.cookies)
  if (req.cookies.drCookie) {
    req.user = req.cookies.drCookie;
  }
  
  next();
})

app.use(serveStatic('webSite/'));
app.use(serveStatic('webSite/html/'))
app.use(serveStatic('JacoCookie/'));
var routes = require('./api/route/3DModelRoute');
routes(app);

https.createServer({	
    key: fs.readFileSync('/etc/letsencrypt/live/flapjacks.goodx.co.za/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/flapjacks.goodx.co.za/cert.pem')
}, app)
.listen(port);

// app.listen(port);

console.log("Restful API for 3DModel Flap Jacks Started On Port "+ port);

module.exports = app; //Added by Marcus: this is related to creating an agent in the unit testing (for using cookies in the unit tests)
