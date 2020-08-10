//created by : Jacobus Janse van Rensburg
   //===========================================================================

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
   //===========================================================================
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
            // console.log(receptionist);
            res.json({"name":receptionist.name,"surname":receptionist.surname,"practition": receptionist.practition,"Note":receptionist.Note}).status(200);
            return;
        });
    },
   //===========================================================================

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
   //===========================================================================

    saveNotes: function(req, res){
        if (!req.user)
        {
            res.status(401);
            return;
        }
        const Notes = req.body.Notes;
        console.log("requiest: "+Notes);

        Receptionist.findOneAndUpdate({"_id":mongoose.Types.ObjectId(req.user)},{$set:{"Note":Notes}},{'new':false},function(err,peceptionist){
            if(err)
            {
                res.status(400).send("NO NO");
                return;
            }

            res.status(200);
            return;
        })

    },
   //===========================================================================

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

    },
   //===========================================================================
 

}
   //===========================================================================
