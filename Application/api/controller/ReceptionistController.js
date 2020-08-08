var fs = require("fs");

const { createModel } = require('mongoose-gridfs');
var formidable = require("formidable");
var mongoose = require("mongoose");
const { userInfo } = require("os");

var Doctor = require("../model/3DModelModel.js").Doctor;
var Patient = require("../model/3DModelModel.js").Patient;
var Consultation = require("../model/3DModelModel.js").Consultation;
var Receptionist = require("../model/3DModelModel.js").Receptionist;

module.exports ={
   
    getNotes : function (req, res){
        if(!req.user){
            res.status(401);
            return;
        }

        Receptionist.findOne();
    }
}