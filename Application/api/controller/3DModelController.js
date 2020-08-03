"use strict";
//set up the database first
var fs = require("fs");

const { createModel } = require('mongoose-gridfs');
var formidable = require("formidable");
var mongoose = require("mongoose");

var Doctor = require("../model/3DModelModel.js").Doctor;
var Patient = require("../model/3DModelModel.js").Patient;
var Consultation = require("../model/3DModelModel.js").Consultation;

module.exports = {
  login: function (req, res) {

    const { username, password } = req.body;
    Doctor.findOne({ username, password }, function (err, doctor) {
      if (err) {
        res.send(err);
      } else {
        if (doctor) {
          // console.log(doctor);

         // res.json(doctor);//send(page);
        //set cookie  redirect to different page
          res.cookie("drCookie",doctor._id,{maxAge:9000000,httpOnly:true});
          res.redirect("/home.html");

        } else {
          var resp ={name:""};
          resp = JSON.stringify(resp)
          res.json(resp);
        }
      }
    });
  },
//======================================================================================

  logout:function (req, res){
    console.log("logging out");
    res.cookie("drCookie","",{maxAge:0,httpOnly:true});
    res.cookie("patientCookie","",{maxAge:0,httpOnly:true});
    res.cookie("consultation","",{maxAge:0});
    res.redirect("/");//redirect not working

  },
//======================================================================================
  signup: function (req, res) {

      const { name , surname,email, username, password } = req.body;

      const doctor = new Doctor({name,surname,email,username, password});
      doctor.save(function (err, saved) {
        if (err) {
          res.send(err);
        } else {
          	const page = fs.readFileSync("webSite/html/login.html", "utf-8");
          	res.setHeader("Content-Type", "text/html");
          	res.status(201).send(page);
        }
      });
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

    // console.log("Setting the patient cookie, Patient Id: "+req.body.PatientID);

    res.cookie("patientCookie",req.body.PatientID).send("Patient Cookie is set");
    // console.log("PatientCookie: "+req.cookies.patientCookie)
    return;
  },
//======================================================================================


  addPatient: function (req, res) {
    // console.log(req.body);
    if (!req.user) {
      return res.status(401);
    }

    const {idNumber, name , surname , email , gender} = req.body;

    //can add checks here too see if the id number matches a patient that belongs to the doctor already exists

    var new_Patient = new Patient({idNumber , name , surname , email , gender}); //set the patients info
    new_Patient.doctor = req.user; // add doctor id to the patient
    new_Patient.save(function (err, patient) {
      if (err) {
        res.status(400).send(err);
        return;
      }
      else{
        res.status(201).json(patient);
        //res.redirect("/displayPatients.html");
        return;
      }
    });
  },
//======================================================================================

  // get single patient by id number
  getSinglePatient: function (req, res) {
    // console.log(req.body);
    const idnumber = req.body.idNumber;
    // console.log(idnumber);
    Patient.findOne({ 'idNumber' : req.body.idNumber , 'doctor':req.user}, function (err, patient) {
      // console.log(patient);
      if (err) {
        res.send(err);
      } else {
        if (patient) {
          res.json(patient);
        } else {
          res.sendStatus(404);
        }
      }
    });
  },
//======================================================================================

  // get list of patients and filter using query parameters
  getPatients: function (req, res) {

    if (!req.user)
    {
      res.status(401).send("Unauthorized");
      return;
    }
    // console.log("Req.user = "+ req.user);
    Patient.find({'doctor': mongoose.Types.ObjectId(req.user)}, function (err, patients) {
      if (err) {
        console.log(err);
        res.status(500).send("Error looking up patients");
        return;
      } else {
        // console.log(patients);
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

    res.cookie("consultation",req.body.ConsultationID).send(200);
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
      // console.log(doctor);
      if (err)
      {
        res.send("No docotor found").status(404);

      }
      else{
        //return only surname for security reasons
        res.json({"surname":doctor.surname});
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

          Patient.findOne({ idNumber: fields.idNumber }, function(err, patient) {
            // handle err
            // handle if patient == null (not found)
            const consultation = new Consultation({
              doctor: req.user, // get from session, e.g. cookies
              patient,
              video: file._id
            });
            consultation.save(function (err, saved) {
              res.sendStatus(201).send(saved);
            });
            // res.send(`Uploaded file ${video.name}`);
          });
        }
      });
    });

  },
//======================================================================================

  

};

