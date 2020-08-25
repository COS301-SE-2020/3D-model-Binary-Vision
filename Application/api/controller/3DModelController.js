//Created by : Jacobus Janse van Rensburg
//Modified by: Steven Visser
//
//This file is where most of the API Functions are declared and initialized. It contains all of the API functions
//that pertain to Logging in/Out, Registration to the system, and functions for most areas of the program that
//require data to be returned from the database.

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
var PasswordChanges = require("../model/3DModelModel.js").PasswordChanges;

module.exports = {

    //Function Developed by: Jacobus Janse van Rensburg
    //This function Populates the doctor cookie with the correct credentials if the doctor logs in successfully
    login: function (req, res) 
    {

        const { username, password } = req.body;

        // var frontSalt = "Pancakes";
        // var backSalt ="bad";
        // var saltedPassword =frontSalt+password+backSalt;
        // password = hash(saltedPassword);

        Doctor.findOne({ username, password }, function (err, doctor) 
        {
            if (err) 
            {
              res.send(err);
              return;
            }

            if (doctor) 
            {
              //it is a doctor logging in and we return to the doctors home page
              res.cookie("drCookie",doctor._id,{maxAge:9000000,httpOnly:true});
              res.redirect("/doctorSchedule.html");
              return;
            }
            //there was no doctor and we will now check if it is a receptionist
        });

        Receptionist.findOne({username,password}, function(err, receptionist)
        {
            if (err)
            {
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

        //res.status(404).send("not found");
        return;
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //This function resets the doctor cookie and returns the user to the preview page
    logout:function (req, res)
    {
        res.cookie("drCookie","",{maxAge:0,httpOnly:true});
        res.cookie("patientCookie","",{maxAge:0,httpOnly:true});
        res.cookie("consultation","",{maxAge:0});
        res.redirect("preview.html");
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //This function allows a user to register to the database as either a doctor or a receptionist
    signup: function (req, res) 
    {
        const { name, surname, email, username, password ,choice , practition} = req.body;
        

        if(choice=="Doctor")
        {
            const doctor = new Doctor({name,surname,email,username, password,practition});
            doctor.save(function (err, saved) 
            {
                if (err) 
                {
                    res.status(400);
                    res.send(err);
                    return;
                }
                else 
                {
                    res.redirect("/login.html");
                    return;
                }
            });
        }
        else if(choice == "Receptionist")
        {
            const receptionist = new Receptionist({name , surname , email , username, password,practition});
            receptionist.save(function(err, saved)
            {
                if(err)
                {
                  res.send(err);
                }
                else
                {
                    res.redirect("/login.html");
                    return;
                }
            });
        }
        return;
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //This function is used for signup to check if the username requested has not already been used by another user
    isValidUsername:function (req, res){
        //no need to check for res.user since this is for signup purposes
        var username = req.body.username;
        Doctor.findOne({"username":username}, function(err, doctor){
            if(doctor!=null)
            {
                // a doctor has this username already and it cannot be used
                res.status(422).json(doctor);//send invalid errorCode
                return;
            }
        });

        Receptionist.findOne({"username":username},function(err,receptionist){
            if(receptionist){
                //a receptionist exists with the user name and therefore cannot be used
                res.status(422).json(receptionist);//send invalid errorCode
                return;
            }
        })

    },

     //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //This function is used for signup to check if the email requested has not already been used by another user
    isValidEmail:function (req, res){
        //no need to check for res.user since this is for signup purposes
        var email = req.body.email;

        Doctor.findOne({"email":email}, function(err, doctor){
            if(doctor)
            {
                // a doctor has this email already and it cannot be used
                res.status(422).json(doctor);//send invalid errorCode
                return;
            }
        });

        Receptionist.findOne({"email":email},function(err,receptionist){
            if(receptionist){
                //a receptionist exists with the user name and therefore cannot be used
                res.status(422).json(receptionist);//send invalid errorCode
                return;
            }
        });

    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //
    selectPatient: function(req,res)
    {
        if (!req.user)
        {
            return res.status(404);
        }
        res.cookie("patientCookie",req.body.PatientID)
          .send("Patient Cookie is set");
        return;
    },

    //======================================================================================
    //Function developed by: Steven Visser
    //This function takes in all the details on a new patient and adds it to the database
    addPatient: function (req, res) 
    {
        if (!req.user) 
        {
            return res.status(401);
        }


        const {idNumber, name , surname , email , gender, cellnumber} = req.body;

        var new_Patient = new Patient({idNumber , name , surname , email ,gender, cellnumber}); //set the patients info

        new_Patient.doctor = req.user; // add doctor id to the patient

        new_Patient.save(function (err) 
        {
            if (err) 
            {
                res.status(400).send(err);
                return;
            }
            else
            {
                res.status(201);
                res.redirect("newHome.html");
                return;
            }
        });
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //Gets a single patient from the databse. Search is done by ID number
    getSinglePatient: function (req, res) 
    {
        Patient.findOne({ '_id' : mongoose.Types.ObjectId(req.body.patient) }, function (err, patient)
        {
            if (err) 
            {
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
    getPatients: function (req, res) 
    {
        if (!req.user)
        {
            res.status(401).send("Unauthorized");
            return;
        }
        Patient.find({'doctor': mongoose.Types.ObjectId(req.user)}, function (err, patients)
        {
            if (err) 
            {
                res.status(500).send("Error looking up patients");
                return;
            } 
            else 
            {
                res.status(202).json(patients);
                return;
            }
        });
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //update patient from form data using id number
    updatePatient: function (req, res) 
    {
        if (!req.user) //user is not logged in and un authorized to access the data
        {
            res.status(404);
            return;
        }

        const form = formidable();
        form.parse(req, (err, fields) => 
        {
            if (err)
            {
                return res.send(err);
            } 

            Patient.findOneAndUpdate(
              { idNumber: req.params.id },
              fields,
              { new: true },
              function (err, patient) 
              {
                  if (err) 
                  {
                      res.status(500)
                        .send("Error updating patient");
                  } 
                  else 
                  {
                      if (patient) 
                      {
                          res.sendStatus(201)
                            .json(patient);
                      } 
                      else 
                      {
                          res.send(404);
                      }
                  }
                }
            );
        });
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //get all the consultations for a certain patient
    getPatientConsultations : function (req , res)
    {

        if (!req.user || req.cookies.patientCookie=="") //user is not logged in and un authorized to access the data
        {
            res.status(404);
            return;
        }

        Consultation.find({"doctor":mongoose.Types.ObjectId(req.user), "patient":mongoose.Types.ObjectId(req.cookies.patientCookie)} , function(err, consultations)
        {
            if (err)
            {
                res.status(500)
                  .send("error geting patient consultation data");
                return;
            }
            else
            {
                res.status(200)
                  .json(consultations);
                return;
            }

        });
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    // used to set a cookie but will be replaced by other means of url encoding
    selectConsultation: function(req,res)
    {
        //set the consultation cookie id
        if(!req.user)
        {
            res.send(401);
            return;
        }
      
        res.cookie("consultation",req.body.ConsultationID)
          .status(200)
            .send("Consultation Cookie successfully set");
        return;
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //
    retrieveConsultationFiles: function(req,res)
    {
        if (!req.user || req.cookies.consultation=="")
        {
            res.send(401);
            return;
        }

        Consultation.findOne({"_id":mongoose.Types.ObjectId(req.cookies.consultation)},function(err , consultation)
        {
            if(err)
            {
                res.status(500)
                  .send("consultation not found");
                return;
            }

            const fileID = consultation.STL;
            if (fileID == null)
            {
                res.status(404)
                  .send("STL File Not Present");
                return;
            }

            //patch the file back together and send the file back

            const returnFile = ModelDB.fs.chunks.find({"files_id": fileID}).sort({n:1});

            res.json({"STL":returnFile});

        });
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //
    getDoctorSurname: function(req, res)
    {
        if (!req.user)
        {
          res.status(401)
            .send("unauthorised");
          return;
        }
      
        Doctor.findOne({"_id":mongoose.Types.ObjectId(req.user)} , function (err , doctor)
        {
            if (err)
            {
                res.send("No docotor found")
                  .status(404);
            }
            else
            {
                res.json({"surname":doctor.surname,"name":doctor.name});
            }
        });
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //
    upload: function(req, res) 
    {
        // use default grid-fs bucket
        const Files = createModel();
        const form = formidable();

        form.parse(req, (err, fields, files) => 
        {
            if (err)
            {
                return res.send(err);
            } 

            const video = files.video;

            const readStream = fs.createReadStream(video.path);

            const options = {
              filename: video.name,
              contentType: video.type
            }

            Files.write(options, readStream, (err, file) => {
              if (err) 
              {
                  res.send(err);
              } 
              else 
              {
                  console.log(file);
                  Patient.findOne({ "_id": req.cookies.patientCookie }, function(err, patient) 
                  {
                      // handle err
                      // handle if patient == null (not found)
                      const consultation = new Consultation(
                      {
                          doctor: req.user, // get from session, e.g. cookies
                          patient: patient._id,
                          video: file._id,
                          Note: "Video upload"
                      });

                      consultation.save(function (err) 
                      {
                          if (err)
                          {
                            res.send(400);
                          }
                          res.status(201)
                            .send("Created");
                          return;
                      });
                  });
              }
            });
        });
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //saves an stl file and makes a consultation
    STLConsultationUpload: function(req,res)
    {
        const files = createModel();
        const form = formidable();
        form.parse(req, (err, fields , files) => 
        {
            if (err) 
            {
                return res.send(err);
            }
          
            const stlFile = files.stlFile;
        
            const readStream = fs.createReadStream(stlFile.path);
          
            const options = {
                filename: stlFile.name,
                contentType: stlFile.type
            }
          
            Files.write(options , readStream , ( err , file)=> 
            {
                if (err)
                {
                    res.send(err);
                    return;
                }
                console.log(file);
                Patients.findOne({"_id":req.cookies.patientCookie} , function(err , patient)
                {
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
                  
                    consultation.save(function (err , consultation)
                    {
                        res.sendStatus(200)
                          .send("Consultation saved");
                    });
                });
            });
        });
    },
  
    //======================================================================================
    //Function developed by: Steven Visser
    //Returns all doctors from the database
    getAllDoctors: function (req, res) 
    {
      if (!req.user)
      {
          res.status(401)
            .send("Unauthorized");
          return;
      }
      Doctor.find({}, function (err, doctor) 
      {
          if (err) 
          {
              res.status(404)
                .send("Error looking up doctor");
              return;
          } 
          else 
          {
              res.status(200)
                .json(doctor);
              return;
          }
      });
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //
    getDoctorsBookings: function (req, res) 
    {
        if (!req.user)
        {
            res.status(401)
              .send("Unauthorized");
            return;
        } 

        Booking.find({"doctor" : mongoose.Types.ObjectId(req.user)}, function (err, bookings) 
        {
            if (err) 
            {
                res.status(500)
                  .send("Error looking up bookings");
                return;
            } 
            else
            {
                res.status(200)
                  .json(bookings);
                return;
            }
        });
    },

    //======================================================================================
    //Function developed by: Steven Visser
    //Returns all patients that match certain criteria from the database
   searchPatient: function(req, res)
   {
        if (!req.user)
        {
            res.status(401);
            return;
        }

        const {name , surname , idNumber} = req.body;

        if(idNumber != null)
        {
            Patient.find({"idNumber":idNumber}, function(err,patient)
            {
                if(err){
                    res.status(400);
                    return;
                }
                if(patient)
                {
                    res.json(patient).status(200);
                    return;
                }
                else
                {
                    res.status(404);
                    return;
                }
            });
        }
        else if(name != null && surname !=null)
        {
            Patient.find({"name":name,"surname":surname}, function(err,patient)
            {
                if(err)
                {
                    res.status(400);
                    return;
                }
                if(patient)
                {
                    res.json(patient)
                      .status(200);
                    return;
                }
                else
                {
                    res.status(404);
                    return;
                }

            });
        }
        else if(name !=null)
        {
            Patient.find({"name":name}, function(err,patient)
            {
                if(err)
                {
                    res.status(400);
                    return;
                }
                if(patient)
                {
                    res.json(patient)
                      .status(200);
                    return;
                }
                else
                {
                    res.status(404);
                    return;
                }
            });
        }
        else if (surname!=null)
        {
            Patient.find({"surname":surname}, function(err,patient)
            {
                if(err)
                {
                    res.status(400);
                    return;
                }
                if(patient)
                {
                    res.json(patient).status(200);
                    return;
                }
                else
                {
                    res.status(404);
                    return;
                }
            });
        }
        else
        {
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
        var d = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear(); 

        Booking.find({"doctor":mongoose.Types.ObjectId(req.user), "date":d}, function(err, bookings)
        {
            if (err)
            {
                res.status(400).send("error looking up bookings");
                return;
            }

            res.json(bookings)
              .status(200);
            return;
        });
    },

    //======================================================================================
    //Function Developed By: Steven Visser
    //Removes a booking from database
    removeBooking: function(req, res)
    {
        if (!req.user)
        {
            res.status(401)
              .send("Unauthorized");
            return;
        }

        var id = mongoose.Types.ObjectId(req.body._id)

        Booking.deleteOne({"_id":id}, function(err)
        {
            if (err)
            {
                res.status(400)
                  .send("Error Removing Booking");
                return;
            }
            res.status(200)
              .send("Booking successfully removed!");
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
        res.status(401)
          .send("Unauthorized");
        return;
      }

      var id = mongoose.Types.ObjectId(req.body._id)
      var date = mongoose.Types.ObjectId(req.body.date);
      var time = mongoose.Types.ObjectId(req.body.time);
    
      Booking.updateOne({"_id":id}, {$set:{"date":date,"time":time}} , function(err)
      {
          if (err)
          {
            res.status(400)
              .send("Error Finding Booking");
            return;
          }
          res.status(200)
            .send("Booking successfully updated!");
          return;
      });
    },

     // ======================================================================================
    // function Developed By: Jacobus Janse van Rensburg
    // function to return a single bookings information provided a booking id 
    getSingleBooking : function(req ,res){
        if(!req.user)
        {
            res.status(401);
            return;
        }

        Booking.findOne({"_id":mongoose.Types.ObjectId(req.body.booking)}, function(err , booking){
            if (err)
            {
                res.status(400);
                return;
            }

            res.status(200).json(booking);
            return;

        });

    },

    //======================================================================================
    //Function developed by: Steven Visser
    //retrieves a specific doctor from the database. Search using object id
    getSingleDoctor: function(req, res)
    {
        if (!req.user)
        {
          res.status(401)
            .send("unauthorised");
          return;
        }
      
        Doctor.findOne({"_id":mongoose.Types.ObjectId(req.body.id)} , function (err , doctor)
        {
            if (err)
            {
                res.send("No docotor found")
                  .status(404);
            }
            else
            {
                res.json({"surname":doctor.surname,"name":doctor.name});
            }
        });
    },
   
    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg and Steven Visser
    //Function uses the users email address to find the correct user and change the password of that user
    resetPassord: function (req , res)
    {
        const {email , password , code} = req.body;

        // console.log("email: "+email +"\npassword: "+password+"\nCode: "+code);
        var updated = false;
        PasswordChanges.findOne({"_id":mongoose.Types.ObjectId(code)}, function (err , record){
            if (record)
            {
                if (email == record.email){
                    // valid details in order to change the password 
                    Doctor.findOneAndUpdate ({"email":email},{$set:{"password":password}}, function(err, doc){
                      if(!doc)//doctor not found
                      {
                          Receptionist.findOneAndUpdate({"email":email}, {$set:{"password":password}},function(err, rec){
                            if(!rec){
                                //invalid user
                                res.status(401).send("not ok");
                                return;
                            }
                            else
                            {
                                updated = true;
                            }

                            if(updated)
                            {   //remove the record so that someone cant use the same values to change the password again
                                PasswordChanges.findOneAndRemove({"_id":mongoose.Types.ObjectId(code)}, function(err){
                                    res.status(200).send("ok");
                                    return;
                                })
                            }
      
                          })
                      }
                      else{
                          updated = true;
                      }

                      if(updated)
                      {
                          //remove the record so that someone cant use the same values to change the password again
                          PasswordChanges.findOneAndRemove({"_id":mongoose.Types.ObjectId(code)}, function(err){
                              res.status(200).send("ok");
                              return;
                          })
                      }

                    })

                }
            }
            else{
                //invalid password change code
                res.status(401).send("not ok");
                return;
            }

        });

        return;
    }


};
