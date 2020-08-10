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
   //function developed by: Jacobus Janse van Rensburg
   //return non-security fatal information about receptionist
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
   //function developed by: Jacobus Janse van Rensburg
   // return the notes that the receptionist might have saved as reminders
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
   //function developed by: Jacobus Janse van Rensburg
   //save a note that is accompanied to a receptionist
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
   //function developed by: Jacobus Janse van Rensburg
   //function that creates a booking object in the database for the receptionist
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
   //Function Developed By: Jacobus Janse van Rensburg
   //Returns a json list of doctors that belong to the same practition as the 
   //receptionist
    getDoctors: function(req,res){
        if(!req.user)
        {
            res.status(401).send("Unauthorised access to doctors");
            return;
        }

        var practition;

        Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)}, function(err, receptionist){
            if(err){
                res.status(400).send(err);
                return;
            }
 
                practition= receptionist.practition;
            
                Doctor.find({"practition":practition},'-password -username',function(err, doctors){
                    if(err){
                        res.status(400).send(err);
                        return;
                    }
                    //cant send all the information since usernames and passwords are high security breaches
        
                    res.status(200).json(doctors);
                    return;
        
                });
        });
            
    },

   //===========================================================================
    

}
   //===========================================================================
