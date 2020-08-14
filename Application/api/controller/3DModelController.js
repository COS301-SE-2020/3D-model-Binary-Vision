// created by : Jacobus Jasnse van Rensburg
"use strict";
//set up the database first
var fs = require("fs");

const { createModel } = require('mongoose-gridfs');
var formidable = require("formidable");
var mongoose = require("mongoose");

var Doctor = require("../model/3DModelModel.js").Doctor;
var Patient = require("../model/3DModelModel.js").Patient;
var Consultation = require("../model/3DModelModel.js").Consultation;
var Receptionist = require("../model/3DModelModel.js").Receptionist;
var Booking = require("../model/3DModelModel.js").Booking;

module.exports = {
  login: function (req, res) {

    const { username, password } = req.body;
    Doctor.findOne({ username, password }, function (err, doctor) {
      if (err) {
        res.send(err);
        return;
      }
      if (doctor) {
        //it is a doctor logging in and we return to the doctors home page
        res.cookie("drCookie",doctor._id,{maxAge:9000000,httpOnly:true});
        res.redirect("/doctorSchedule.html");
        return;
      }
      //there was no doctor and we will now check if it is a receptionist
    });

    Receptionist.findOne({username,password}, function(err, receptionist){

      if (err){
        res.send(err);
        return;
      }

      if (receptionist)
      {
        res.cookie("drCookie",receptionist._id,{maxAge:9000000,httpOnly:true});
        res.redirect("/newHome.html");
        return;
      }
    });
  },

//======================================================================================
  logout:function (req, res){
    res.cookie("drCookie","",{maxAge:0,httpOnly:true});
    res.cookie("patientCookie","",{maxAge:0,httpOnly:true});
    res.cookie("consultation","",{maxAge:0});
    res.redirect("preview.html");//redirect not working

  },
//======================================================================================
  signup: function (req, res) {

      const { name , surname,email, username, password ,choice , practition} = req.body;
      if(choice=="Doctor"){

      const doctor = new Doctor({name,surname,email,username, password,practition});
      doctor.save(function (err, saved) {
        if (err) {
          res.send(err);
        } else {
          	const page = fs.readFileSync("webSite/html/login.html", "utf-8");
          	res.setHeader("Content-Type", "text/html");
          	res.status(201).send(page);
        }
      });
    }
    else if(choice == "Receptionist"){
      const receptionist = new Receptionist({name , surname , email , username, password,practition});
      receptionist.save(function(err, saved){
        if(err){
          res.send(err);
        }
        else{
          const page = fs.readFileSync("webSite/html/login.html","utf-8");
          res.setHeader("Content-Type","text/html");
          res.status(200).send(page);
        }
      });
    }
  },
//======================================================================================

  selectPatient: function(req,res){
    if (!req.user)
    {
      return res.status(404);
    }
    else {
      //
    }


    res.cookie("patientCookie",req.body.PatientID).send("Patient Cookie is set");
    return;
  },
//======================================================================================
  addPatient: function (req, res) {
    if (!req.user) {
      return res.status(401);
    }


    const {idNumber, name , surname , email , gender, cellnumber} = req.body;

    //can add checks here too see if the id number matches a patient that belongs to the doctor already exists

    var new_Patient = new Patient({idNumber , name , surname , email , gender, cellnumber}); //set the patients info
    new_Patient.doctor = req.user; // add doctor id to the patient
    new_Patient.save(function (err, patient) {
      if (err) {
        res.status(400).send(err);
        return;
      }
      else{
        res.status(201);
        res.redirect("newHome.html");
        //res.redirect("/displayPatients.html");
        return;
      }
    });
  },
//======================================================================================

  //  single patient by id number
  getSinglePatient: function (req, res) {
   
    Patient.findOne({ '_id' : mongoose.Types.ObjectId(req.body.patient) }, function (err, patient) {
      if (err) {
        res.send(err);
        return;
      } 

  
      res.json(patient);
      return;  
      
    });
  },
//======================================================================================

  // get list of patients and filter using query parameters
  //may need to be deprecated
  getPatients: function (req, res) {

    if (!req.user)
    {
      res.status(401).send("Unauthorized");
      return;
    }
    Patient.find({'doctor': mongoose.Types.ObjectId(req.user)}, function (err, patients) {
      if (err) {
        res.status(500).send("Error looking up patients");
        return;
      } else {
        res.status(202).json(patients);
        return;
      }
    });
  },
//======================================================================================

  // update patient from form data using id number
  updatePatient: function (req, res) {
    if (!req.user) //user is not logged in and un authorized to access the data
    {
      res.status(404);
      return;
    }

    const form = formidable();
    form.parse(req, (err, fields) => {
      if (err) return res.send(err);
      Patient.findOneAndUpdate(
        { idNumber: req.params.id },
        fields,
        { new: true },
        function (err, patient) {
          if (err) {
            res.status(500).send("Error updating patient");
          } else {
            if (patient) {
              res.sendStatus(201).json(patient);
            } else {
              res.send(404);
            }
          }
        }
      );
    });
  },
//======================================================================================

  //get all the consultations for a certain patient
  getPatientConsultations : function (req , res){

    if (!req.user || req.cookies.patientCookie=="") //user is not logged in and un authorized to access the data
    {
      res.status(404);
      return;
    }

    Consultation.find({"doctor":mongoose.Types.ObjectId(req.user), "patient":mongoose.Types.ObjectId(req.cookies.patientCookie)} , function(err, consultations){
      if (err)
      {
        res.status(500).send("error geting patient consultation data");
        return;
      }
      else{
        res.status(200).json(consultations);
        return;
      }

    })
  },
//======================================================================================

  selectConsultation: function(req,res)
  {
    //set the consultation cookie id
    if(!req.user)
    {
      res.send(401);
      return;
    }

    res.cookie("consultation",req.body.ConsultationID).status(200).send("Consultation Cookie successfully set");
    return;
  },

  retrieveConsultationFiles: function(req,res){

    if (!req.user || req.cookies.consultation=="")
    {
      res.send(401);
      return;
    }

    Consultation.findOne({"_id":mongoose.Types.ObjectId(req.cookies.consultation)},function(err , consultation){
      if(err)
      {
        res.status(500).send("consultation not found");
        return;
      }

      const fileID = consultation.STL;
      if (fileID == null){
        res.status(404).send("STL File Not Present");
        return;
      }

      //patch the file back together and send the file back

      const returnFile = ModelDB.fs.chunks.find({"files_id": fileID}).sort({n:1});

      res.json({"STL":returnFile});

    })
  },

//======================================================================================
  getDoctorSurname: function(req, res)
  {
    if (!req.user)
    {
      res.status(401).send("unauthorised");
      return;
    }

    Doctor.findOne({"_id":mongoose.Types.ObjectId(req.user)} , function (err , doctor){
      if (err)
      {
        res.send("No docotor found").status(404);

      }
      else{
        //return only surname for security reasons
        res.json({"surname":doctor.surname,"name":doctor.name});
      }
    })

  },
//======================================================================================

//upload

  upload: function(req, res) {
    // use default grid-fs bucket
    const Files = createModel();

    const form = formidable();
    form.parse(req, (err, fields, files) => {
      if (err) return res.send(err);

      const video = files.video;

      const readStream = fs.createReadStream(video.path);

      const options = {
        filename: video.name,
        contentType: video.type
      }

      Files.write(options, readStream, (err, file) => {
        if (err) {
          res.send(err);
        } else {
          console.log(file);

          Patient.findOne({ "_id": req.cookies.patientCookie }, function(err, patient) {
            // handle err
            // handle if patient == null (not found)
            const consultation = new Consultation({
              doctor: req.user, // get from session, e.g. cookies
              patient: patient._id,
              video: file._id,
              Note: "Video upload"
            });
            consultation.save(function (err, saved) {
              if (err)
              {
                res.send(400);

              }
              res.status(201).send("Created");
              return;
            });
          });
        }
      });
    });

  },

  //======================================================================================
  //saves an stl file and makes a consultation
  STLConsultationUpload: function(req,res){
    const files = createModel();
    const form = formidable();
    form.parse(req, (err, fields , files) => {

      if (err) return res.send(err);

      const stlFile = files.stlFile;

      const readStream = fs.createReadStream(stlFile.path);

      const options = {
        filename: stlFile.name,
        contentType: stlFile.type
      }

      Files.write(options , readStream , ( err , file)=> {

        if (err)
        {
          res.send(err);
          return;
        }
        console.log(file);
        Patients.findOne({"_id":req.cookies.patientCookie} , function(err , patient){

          if (err)
          {
            res.status(403).send("patient cookie not set");
            return;
          }

          const consultation = new Consultaion({
            doctor: req.user,
            patient,
            STL: file._id,
            Note: req.body.note
          });

          consultation.save(function (err , consultation){
            res.sendStatus(200).send("Consultation saved");
          });


        });
      });
    });

  },
  //======================================================================================

  //this isnt done yet, i had to go

  //======================================================================================

  getAllDoctors: function (req, res) {

    if (!req.user)
    {
      res.status(401).send("Unauthorized");
      return;
    }

    Doctor.find({}, function (err, doctor) {
      if (err) {
        res.status(404).send("Error looking up doctor");
        return;
      } else {
        res.status(200).json(doctor);
        return;
      }
    });
  },
//======================================================================================

  getDoctorsBookings: function (req, res) {

    if (!req.user)
    {
      res.status(401).send("Unauthorized");
      return;
    } 

    Booking.find({"doctor" : mongoose.Types.ObjectId(req.user)}, function (err, bookings) {
      if (err) {
        res.status(500).send("Error looking up bookings");
        return;
      } else {
        res.status(200).json(bookings);
        return;
      }
    });
  },

//======================================================================================
   // search for patients based on certain criteria
   //developed by: Jacobus Janse van Rensburg
   searchPatient: function(req, res)
   {
      if (!req.user){
          res.status(401);
          return;
      }

      const {name , surname , idNumber} = req.body;

      if(idNumber != null){
        Patient.find({"idNumber":idNumber}, function(err,patient){
          if(err){
            res.status(400);
            return;
          }
          if(patient){
            res.json(patient).status(200);
            return;
          }
          else{
            res.status(404);
            return;
          }

        });
      }
      else if(name != null && surname !=null)
      {
        Patient.find({"name":name,"surname":surname}, function(err,patient){
          if(err){
            res.status(400);
            return;
          }
          if(patient){
            res.json(patient).status(200);
            return;
          }
          else{
            res.status(404);
            return;
          }

        });
      }
      else if(name !=null)
      {
        Patient.find({"name":name}, function(err,patient){
          if(err){
            res.status(400);
            return;
          }
          if(patient){
            res.json(patient).status(200);
            return;
          }
          else{
            res.status(404);
            return;
          }
        });
      }
      else if (surname!=null)
      {
        Patient.find({"surname":surname}, function(err,patient){
          if(err){
            res.status(400);
            return;
          }
          if(patient){
            res.json(patient).status(200);
            return;
          }
          else{
            res.status(404);
            return;
          }
        });
      }
      else{
        res.status(400);
        return;
      }
  },

// ======================================================================================
// function Developed By: Jacobus Janse van Rensburg
// returns the bookings that the doctor has for the current date
  getTodaysBookings: function(req, res)
  {
    if (!req.user)
    {
      res.status(401).send("Unauthorized");
      return;
    }
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    var d = day + "/" + month + "/" + year; 

    Booking.find({"doctor":mongoose.Types.ObjectId(req.user), "date":d}, function(err, bookings){
      if (err)
      {
        res.status(400).send("error looking up bookings");
        return;
      }


      res.json(bookings).status(200);
      return;
    });
  },

// ======================================================================================
// function Developed By: Steven Visser
// removes a booking from databse
  removeBooking: function(req, res)
  {
    if (!req.user)
    {
      res.status(401).send("Unauthorized");
      return;
    }
    
    var id = mongoose.Types.ObjectId(req.body._id)

    Booking.deleteOne({"_id":id}, function(err){
      if (err)
      {
        res.status(400).send("Error Removing Booking");
        return;
      }
      res.status(200).send("Booking successfully removed!");
      return;
    });
  },

// ======================================================================================
// function Developed By: Steven Visser
// Updates a booking date & time based on booking id
updateBooking: function(req, res)
{
  if (!req.user)
  {
    res.status(401).send("Unauthorized");
    return;
  }
  
  var id = mongoose.Types.ObjectId(req.body._id)
  var date = mongoose.Types.ObjectId(req.body.date);
  var time = mongoose.Types.ObjectId(req.body.time);

  Booking.updateOne({"_id":id}, {$set:{"date":date,"time":time}} , function(err){
    if (err)
    {
      res.status(400).send("Error Finding Booking");
      return;
    }
    res.status(200).send("Booking successfully updated!");
    return;
  });
},

};
