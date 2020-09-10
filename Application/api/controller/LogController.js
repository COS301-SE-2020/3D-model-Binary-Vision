//Created by: Steven Visser
//
//This file holds all of the API functions that will be used to write to the log file for each practice
//and to retrieve it when certain security requirements have been met.

//Includes the File System node functions
var fs = require("fs");
const { createModel } = require('mongoose-gridfs');
var formidable = require("formidable");

module.exports = {

    createLog: function(req, res)
    {
        var practice = req.body.practice;
        var today = new Date();
        var date = today.getDate() + ' / ' + (today.getMonth()+1) +' / '+ today.getFullYear();
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var seconds = today.getSeconds();
        var time = hours + ":" + minutes + ":" + seconds ;
        var line = date + "@" + time + "@" + practice + " Registered!"
        alert(line);
    }

}