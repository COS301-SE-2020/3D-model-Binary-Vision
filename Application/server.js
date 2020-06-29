
//variables needed
var express = require('express'),
    app = express(),
    port =process.env.PORT || 3000,
    mongoose =require('mongoose'),
    bodyParser = require('body-parser'),
    serveStatic= require('serve-static');

var MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

//mongoose instance connection url connection
// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ModelDB', MONGO_OPTIONS);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.use(serveStatic('webSite/'));
app.use(serveStatic('JacoCookie/'));
var routes = require('./api/route/3DModelRoute');
routes(app);

app.listen(port);

console.log("Restful API for 3DModel Flap Jacks Started On Port "+ port);
