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

          res.json(doctor);//send(page);
        
    
        } else {
          var resp ={name:""}; 
          resp = JSON.stringify(resp)
          res.json(resp);
        }
      }
    });
  },

  signup: function (req, res) {
    // const form = formidable();
    
    // form.parse(req, (err, fields) => {
    //   if (err) return res.send(err);
    //   console.log(fields);

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

  addPatient: function (req, res) {
    // console.log(req.body);
    var new_Patient = new Patient(req.body);
    new_Patient.save(function (err, patient) {
      if (err) res.send(err);
      res.status(201).json(patient);
    });
  },

  // get single patient by id number
  getSinglePatient: function (req, res) {
    console.log(req.body);
    const idnumber = req.body.idNumber;
    console.log(idnumber);
    Patient.findOne({ 'idNumber' : req.body.idNumber }, function (err, patient) {
      console.log(patient);
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

  // get list of patients and filter using query parameters
  getPatients: function (req, res) {
    Patient.find(req.query, function (err, patients) {
      if (err) {
        res.status(500).send("Error looking up patients");
      } else {
        res.sendStatus(202).json(patients);
      }
    });
  },

  // update patient from form data using id number
  updatePatient: function (req, res) {
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
              doctor: new mongoose.Types.ObjectId(), // get from session, e.g. cookies
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
  }
};

//will use GridFS to send and retrieve data
// exports.uploadedMedia = function(req,res)
// {

// }
