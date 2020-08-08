var fs = require("fs");

const { createModel } = require('mongoose-gridfs');
var formidable = require("formidable");
var mongoose = require("mongoose");
const { userInfo } = require("os");

var Doctor = require("../model/3DModelModel.js").Doctor;
var Patient = require("../model/3DModelModel.js").Patient;
var Consultation = require("../model/3DModelModel.js").Consultation;
var Receptionist = require("../model/3DModelModel.js").Receptionist;
var Booking = require("../model/3DModelModel.js").Bookings;

module.exports ={
   
    getReceptionistInfo: function(req,res){
        if(!req.user){
            res.status(401);
            return;
        }

        Receptionist.findOne({"_id":req.user},function(err, receptionist){
            if (err)
            {
                res.status(400).send(err);
                return;
            }

            res.json(receptionist).status(200);
            return;
        });
    },

    getNotes : function (req, res){
        if(!req.user){
            res.status(401);
            return;
        }

        Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)}, function (err, receptionist){

            if(err)
            {
                res.status(404);
                return;
            }
            else{
                var Notes = receptionist.Note;
                res.status(200).json({"Note":Notes});
                return;
            }

        });
    },

    saveNotes: function(req, res){
        if (!req.user)
        {
            res.status(401);
            return;
        }

        const notes = req.body.Notes;

        Receptionist.findOneAndUpdate({"_id":mongoose.Types.ObjectId(req.user)},{$set:{"Note":notes}},{"new":true},function(err,peceptionist){
            if(err)
            {
                res.status(400);
                return;
            }

            res.status(200);
        })

    },

    makeBooking:function (req,res){

        if (!req.user){
            res.status(401);
            return;
        }

        const {patient, doctor, time ,date, reason} = req.body;

        var newBooking = new Booking({date,time,doctor,patient,reason})
        
        newBooking.save(function(err,booking){
            if(err){
                res.status(400).send(err);
                return;
            }

            res.status(200).json(booking);

        })

    }


}