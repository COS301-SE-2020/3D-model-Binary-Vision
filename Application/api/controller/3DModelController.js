//Created by : Jacobus Janse van Rensburg
//Modified by: Steven Visser
//
//This file is where most of the API Functions are declared and initialized. It contains all of the API functions
//that pertain to Logging in/Out, Registration to the system, and functions for most areas of the program that
//require data to be returned from the database.

"use strict";
//set up the database first

var fs = require("fs");
const bcrypt = require('bcrypt');
const { createModel } = require('mongoose-gridfs');
var formidable = require("formidable");
var mongoose = require("mongoose");
var qrCode = require('qrcode');

var Doctor = require("../model/3DModelModel.js").Doctor;
var Patient = require("../model/3DModelModel.js").Patient;
var Consultation = require("../model/3DModelModel.js").Consultation;
var Receptionist = require("../model/3DModelModel.js").Receptionist;
var Booking = require("../model/3DModelModel.js").Booking;
var PasswordChanges = require("../model/3DModelModel.js").PasswordChanges;
var Practice = require("../model/3DModelModel.js").Practice;

//Email modules and settings to send emails
var nodeMailer = require('nodemailer');

//const transporter = nodeMailer.createTransport({
//    host:"smtp.mailtrap.io",
//    port: 2525,
//    auth:{
//        user:"0c9f2b08034ef4",
//        pass:"c1fd4b36bbc842"
//    } 
// });


var transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
           user: 'flap.jacks.cs@gmail.com',
           pass: 'ampjiedsvncvukaz'
       }
   });


const frontsalt ="Lala";
const  backSalt = "Bey";

module.exports = {

    //Function Developed by: Jacobus Janse van Rensburg
    //This function Populates the doctor cookie with the correct credentials if the doctor logs in successfully
    login: function (req, res) 
    {
        var { username, password } = req.body;

        password = frontsalt+password+backSalt;

        Doctor.findOne({ username , "active":true}, function (err, doctor) 
        {         
            if (err) 
            {
                console.log("error");
                return;
            }
            if (doctor) 
            {
                //check if the passwords match
                bcrypt.compare(password , doctor.password, function(erro , result){
                    if(result == true){
                        //it is a doctor logging in and we return to the doctors home page
                        res.cookie("drCookie",doctor._id,{maxAge:9000000,httpOnly:true});
                        res.redirect("/doctorSchedule.html");
                        updateLogFile(username+"@Logged in",doctor.practition);
                        return;
                    }
                    else{
                        res.send(erro);
                        return;
                    }
                })        
            }
            //there was no doctor and we will now check if it is a receptionist
        });

        Receptionist.findOne({username,"active":true}, function(err, receptionist){

            if (err)
            {
              res.send(err);
              return;
            }
    
            if (receptionist)
            {
                bcrypt.compare(password , receptionist.password, function (error, result){
                   if (result == true){
                        res.cookie("drCookie",receptionist._id,{maxAge:9000000,httpOnly:true});
                        res.redirect("/newHome.html");
                        updateLogFile(username+"@Logged in",receptionist.practition);
                        return;
                   }
                   else{
                       res.send(error);
                       return;
                   }
                    
                })

            }
        });
        res.status(404);
        return;
    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //Updated by: Steven Visser
    //This function resets the doctor cookie and returns the user to the preview page and updates the log file
    logout:function (req, res)
    {
        Doctor.findOne({"_id":mongoose.Types.ObjectId(req.user)} , function (err , doctor)
        {
            if (err)
            {

            }
            if(doctor)
            {
                updateLogFile(doctor.username + "@Logout",doctor.practition);
            }
        });
        Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)} , function (err , rec)
        {
            if (err)
            {

            }
            if(rec)
            {
                updateLogFile(rec.username + "@Logout",rec.practition);
            }
        });
        res.cookie("drCookie","",{maxAge:0,httpOnly:true});
        res.cookie("patientCookie","",{maxAge:0,httpOnly:true});
        res.cookie("consultation","",{maxAge:0});
        res.redirect("preview.html");
    },

    //======================================================================================
    //function developed by: Jacobus Janse van Rensburg
    //Allows the registration of a new practice
    //modified by: Steven Visser 
    //reason: Create a qr code for the practice to add patients as well
    practiceRegistration: function(req, res){
        const {practice , securityCode, headReceptionist} = req.body;

        Practice.findOne({"practice":practice}, function(err, prac){

            if (prac != null /*|| prac != ""*/)
            {   
                //practition already registered;
                res.status(400).send("Practice already exists");
                return;
            }
            else
            {   
                var newPractice = new Practice ({practice,securityCode,headReceptionist});
                newPractice.save(function(err, pr)
                {

                    if(err)
                    {
                        res.send(err);
                        return;
                    }
                    else
                    {

                        var today = new Date();
                        var date = today.getDate() + '/' + (today.getMonth()+1) +'/'+ today.getFullYear();
                        var hours = today.getHours();
                        var minutes = today.getMinutes();
                        var seconds = today.getSeconds();
                        var time = hours + ":" + minutes + ":" + seconds ;
                        var line = date + "@" + time + "@Practice: " + practice + " Registered!\n";
                        var fname = "./webSite/Logs/"+practice+".txt";
                        fs.writeFile(fname,line,function(err){
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                //console.log("Practice Log File successfully created!");
                            }
                        });
                        res.redirect('/signup.html');
                        return;
                    }
                });
            }
        });

    },

    //======================================================================================
    //Function developed by: Jacobus Janse van Rensburg
    //This function allows a user to register to the database as either a doctor or a receptionist
    signup: function (req, res) 
    {
        var { name, surname, email, username, password ,choice , practition,securityCode} = req.body;
       
        //first check if the practition exists
        Practice.findOne({"practice":practition}, function(err, practice)
        {
            if (err)
            {
                res.status(400);
                return;
            }
            if(practice != null)
            {
                if(practice.securityCode == securityCode)
                {
                    //valid practition code to add inactive user to database and send an email to head receptionist
                    password = frontsalt+password+backSalt;
                    bcrypt.hash(password,10,function(err, password1){
                        password = password1;
                        //before these ifs, check the the username exists already as either a doctor or a receptionist
                        //then check if the emails exists asa either a doctor or a receptionist
                        var bool = false;
                        Doctor.findOne({"email":email},function(err,doc){
                            if(doc != null)
                            {
                                bool = true;
                                res.status(403);
                                return;
                            }
                        });
                        Doctor.findOne({"username":username},function(err,doc){
                            if(doc != null)
                            {
                                bool = true;
                                res.status(402);
                                return;
                            }
                        });
                        Receptionist.findOne({"email":email},function(err,rec){
                            if(rec != null)
                            {
                                bool = true;
                                res.status(403);
                                return;
                            }
                        });
                        Receptionist.findOne({"username":username},function(err,rec){
                            if(rec != null)
                            {
                                bool = true;
                                res.status(402);
                                return;
                            }
                        });
                        if(choice=="Doctor" && bool == false)
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
                                    //email the head receptionist over here
                                    sendsignupConfirmationEmail(practice , doctor);
                                    res.redirect("/login.html");
                                    return;
                                }
                            });
                        }
                        else if(choice == "Receptionist" && bool == false)
                        {
                            const receptionist = new Receptionist({name , surname , email , username, password,practition});
                            receptionist.save(function(err, saved)
                            {
                                if(err)
                                {   
                                    res.status(400);
                                    res.send(err);
                                    return;
                                }
                                else
                                {
                                    //email the head receptionist over here
                                    sendsignupConfirmationEmail(practice , receptionist);
                                    res.redirect("/login.html");
                                    return;
                                }
                            });
                        }
                    });

                }
                else{
                    //practition code not valid for signup attempt
                    //unauthorized
                    res.sendStatus(401); // Marcus Changed this from status -> senStatus
                    return;
                }
            }
            else{
                //no practice found
                res.sendStatus(404); // Marcus Changed this from status -> senStatus
                return;
                //register a new practice ?
            }
        });

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
            return res.sendStatus(404); // Changed by Marcus from status --> sendStatus
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
        const {idNumber, name , surname , email , gender, cellnumber,practice} = req.body;
        Patient.findOne({"idNumber":idNumber},function(err,pat)
        {
            if(pat != null)
            {
                res.status(400).send("Patient with that ID number already exists on the system");
                return;
            }
            else
            {
                if (!req.user) 
                {
                
                    var new_Patient = new Patient({idNumber , name , surname , email ,gender, cellnumber,practice}); //set the patients info
                
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
                            res.redirect("preview.html");
                        }
                    });
                
                    updateLogFile("Added a Patient@PID:" +new_Patient._id,practice);
                    return;
                }
                else
                {
                    //this is a receptionist adding a patient
                    const {idNumber, name , surname , email , gender, cellnumber} = req.body;
                
                    Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)} , function (err , rec)
                    {
                        if (err)
                        {
                        
                        }
                        if(rec)
                        {
                            var new_Patient = new Patient({idNumber , name , surname , email ,gender, cellnumber}); //set the patients info
                        
                            new_Patient.practice = rec.practition;
                        
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
                                }
                            });
                            updateLogFile(rec.username + "@Added a Patient@PID:" +new_Patient._id,rec.practition);
                        }
                    });
                    return;
                }        
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
                res.status(400).send(err);
                return;
            } 
            res.status(200).json(patient);
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
    // used to set a cookie but will be replaced by other means of url encoding
    selectConsultation: function(req,res)
    {
        //set the consultation cookie id
        if(!req.user)
        {
            res.status(401).send("Unauthorized");
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
            res.status(401).send("Unauthorized");
            return;
        }

        Consultation.findOne({"_id":req.cookies.consultation},function(err , consultation)
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

    getDoctorBasedOnID: function (req, res){

        if ( ! req.user)
        {
            return res.sendStatus(401);
        }

        Doctor.findOne({"_id":mongoose.Types.ObjectId(req.body.id)},function(err, doc){
            if(doc!="")
            {
                res.status(200).json({"surname":doc.surname,"name":doc.name});
                return;
            }
            else{
                res.status(404);
                return;
            }
        })
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
                  Patient.findOne({ "_id": req.cookies.patientCookie }, function(err, patient) 
                  {
                      // handle err
                      // handle if patient == null (not found)
                      const consultation = new Consultation(
                      {
                          doctor: req.user, // get from session, e.g. cookies
                          patient: patient._id,
                          video: file._id,
                          Note: "Video Upload"
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
                        Note: "STL Upload"
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

    //=============================================================================================
    //Function developed by: Jacobus Janse van Rensburg 
    //Function used to return a .obj file to be used in a render

    getOBJFile: function (req,res){
        if(!req.user){
            res.status(401).send("Unauthorized");
            return;
        }
        else {

            var consultation = req.params.id;

            Consultation.findOne({"_id":consultation}, function(err , cons){
                if (err){

                }
                else if (cons) {
                    var attachment = createModel();
                    const objReturn  = attachment.read({"_id":cons.OBJ});

                    res.contentType('text/plain');
                    objReturn.pipe(res);
                    return;
                }
                else{
                    return res.sendStatus(404);
                }

            })

        }
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
              res.status(404).send("Error looking up doctor");
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
            res.status(401).send("Unauthorized");
            return;
        }

        const {name , surname , idNumber} = req.body;

        Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)} , function (err , rec)
        {
            if (err)
            {

            }
            if(rec)
            {
                if(idNumber != null)
                {
                    Patient.find({"idNumber":idNumber,"practice":rec.practition}, function(err,patient)
                    {
                        if(err){
                            res.status(400);
                            return;
                        }
                        if(patient!="")
                        {
                            res.json(patient).status(200);
                            return;
                        }
                        else
                        {
                            res.status(404).send("No patient found");
                            return;
                        }
                    });
                }
                else if(name != null && surname !=null)
                {
                    Patient.find({"name":name,"surname":surname,"practice":rec.practition}, function(err,patient)
                    {
                        if(err)
                        {
                            res.status(400);
                            return;
                        }
                        if(patient!="")
                        {
                            res.json(patient)
                              .status(200);
                            return;
                        }
                        else
                        {
                            res.status(404).send("No patient found");
                            return;
                        }
                    
                    });
                }
                else if(name !=null)
                {
                    Patient.find({"name":name,"practice":rec.practition}, function(err,patient)
                    {
                        if(err)
                        {
                            res.status(400);
                            return;
                        }
                        if(patient!="")
                        {
                            res.json(patient);
                            return;
                        }
                        else
                        {
                            res.status(404).send("No patient found");
                            return;
                        }
                    });
                }
                else if (surname!=null)
                {
                    Patient.find({"surname":surname,"practice":rec.practition}, function(err,patient)
                    {
                        if(err)
                        {
                            res.status(400);
                            return;
                        }
                        if(patient!="")
                        {
                            res.json(patient).status(200);
                            return;
                        }
                        else
                        {
                            res.status(404).send("No patient found");
                            return;
                        }
                    });
                }
                else
                {
                    res.status(400);
                    return;
                }
            }
        });
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

        Booking.deleteOne({"_id":id}, function(err,booking)
        {
            if (err)
            {
                res.status(400)
                  .send("Error Removing Booking");
                return;
            }

            deletedBookingEmail(booking);
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

      var id = mongoose.Types.ObjectId(req.body._id);
      var status = req.body.status;

      Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)} , function (err , rec)
      {
          if (err)
          {

          }
          if(rec)
          {
              if(status=="Postponed")
              {
                updateLogFile(rec.username + "@Postponed a booking@BID:"+id,rec.practition);
              }
              else if(status == "Cancelled")
              {
                updateLogFile(rec.username + "@Cancelled a booking@BID:"+id,rec.practition);
              }
          }
      });

      Doctor.findOne({"_id":mongoose.Types.ObjectId(req.user)} , function (err , doc)
      {
          if (err)
          {

          }
          if(doc)
          {
              if(status == "Completed")
              {
                updateLogFile(doc.username + "@Completed a booking@BID:"+id,doc.practition);
              }
          }
      });
    
      Booking.findOneAndUpdate({"_id":id}, {$set:{"status":status}} , function(err,booking)
      {
          if (err)
          {
            res.status(400)
              .send("Error Finding Booking");
            return;
          }

          updateBookingEmail(booking);
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
            res.status(401).send("Unauthorized");
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
            if (err /*|| doctor == null*/)
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
        var {email , password , code} = req.body;

        console.log("here");

        password = frontsalt+password+backSalt;
        var updated = false;
        PasswordChanges.findOne({"_id":mongoose.Types.ObjectId(code)}, function (err , record){
            if (record)
            {
                if (email == record.email){
                    // valid details in order to change the password 
                    bcrypt.hash(password,10,function(err, p1){   //hash the new password in the back end as well
                        Doctor.findOneAndUpdate ({"email":email},{$set:{"password":p1}}, function(err, doc){
                            if(!doc)//doctor not found
                            {
                                Receptionist.findOneAndUpdate({"email":email}, {$set:{"password":p1}},function(err, rec){
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
    },

    //=======================================================================================
    //Function developed by: Jacobus Janse van Rensburg 
    // function to accept / reject a user signing up
    activateUser:function ( req, res)
    {
        const {user , choice } = req.body;
        if(choice =="accept")
        {
             //acticate the user
             Doctor.findOneAndUpdate({"_id":mongoose.Types.ObjectId(user)}, {$set:{"active":true}}, function (err, doc){
                //if doctor not look for a receptionist
             if(!doc) 
             {  
                 //find and update receptionist
                 Receptionist.findOneAndUpdate({"_id":mongoose.Types.ObjectId(user)},{$set:{"active":true}}, function(err, rec){
                    if(rec)
                    {
                        updateLogFile("PracticeHead@Accepted Receptionist Application@ID:"+rec._id,rec.practition);
                    }
                });
            }
            else
            {
                updateLogFile("PracticeHead@Accepted Doctor Application@ID:"+doc._id,doc.practition);
            }
            });
        }
        else
        {
            Doctor.find({"_id":mongoose.Types.ObjectId(user)}, function(err,doc)
            {
                if(doc)
                {
                   updateLogFile("PracticeHead@Denied Receptionist Application@ID:"+doc._id,doc.practition);
                   Doctor.deleteOne({"_id":mongoose.Types.ObjectId(user)}, function(err, doct)
                   {
                        if(doct)
                        {
                            updateLogFile("PracticeHead@Denied Receptionist Application@ID:"+doct._id,doct.practition);
                        }
                   });
                   return;
                }
            });
            
            Receptionist.find({"_id":mongoose.Types.ObjectId(user)}, function(err, rec)
            {
                 if(rec)
                 {
                    updateLogFile("PracticeHead@Denied Receptionist Application@ID:"+rec._id,rec.practition);
                    Receptionist.deleteOne({"_id":mongoose.Types.ObjectId(user)}, function(err, rect)
                    {
                         if(rect)
                         {
                             updateLogFile("PracticeHead@Denied Receptionist Application@ID:"+rect._id,rect.practition);
                         }
                    });
                    return;
                 }
            });
        } 
        res.status(200).send("ok");
        return;
    },

    //=======================================================================================
    //function developed by:Jacobus Janse van Rensburg
    //function returns a qr code for patients to scan when new to a practice
    generatePatientSignupQRCode: function(req , res){

        if(!req.user)
        {
            res.status(401).send("Unauthorized");
            return;
        }
        else{
            
            Doctor.findOne({"_id":mongoose.Types.ObjectId(req.user)},function(err, doctor){
                if (err){

                }
                else if(doctor){
                    var url = "https://flapjacks.goodx.co.za/QRAddPatient.html?practice="+doctor.practition;
                    res.contentType('png');
                    qrCode.toFileStream(res , url);//return the qr code
                }
                else{
                    Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)},function(err, recep){
                        if(err){

                        }
                        else if(recep){
                            var url = "https://flapjacks.goodx.co.za/QRAddPatient.html?practice="+recep.practition;
                            res.contentType('png');
                            qrCode.toFileStream(res , url);
                        }
                        else{
                            //no user found with id 
                            res.sendStatus(404);
                        }
                    })
                }
            })
            //create the qr code
        }

    },

    //======================================================================================
    //Function Developed By: Steven Visser
    //Updates the logfile for a specific practice
    updateLog: function(req, res)
    {
        var practice = req.body.practice;
        var line = req.body.line + "\n";
        var fname = "./webSite/Logs/"+practice+".txt";
        fs.appendFile(fname,line,function(err)
        {
            if(err)
            {
                console.log(err);
                res.status(401).send(err);
            }
            else
            {
                console.log("Log successfully updated!");
                res.status(200).send("Log successfully updated!");
            }
        });
        
    },

    //======================================================================================
    //Function Developed By: Steven Visser
    //Uploads a regular consultation
    saveConsultation: function(req, res)
    {
        if(!req.user)
        {
            res.status(401).send("Unauthorized");
            return;
        }

        Patient.findOne({ "_id":req.body._id}, function(err, patient) 
        {
            var today = new Date();
            var date = today.getDate() + '/' + (today.getMonth()+1) +'/'+ today.getFullYear();
            const consultation = new Consultation(
            {
                created:date,
                doctor: req.user, // get from session, e.g. cookies
                patient: req.body._id,
                Note: req.body.note,
                reason: req.body.reason
            });

            Doctor.findOne({"_id":mongoose.Types.ObjectId(req.user)} , function (err , doctor)
            {
                if (err)
                {
    
                }
                if(doctor)
                {
                    updateLogFile(doctor.username + "@Saved a consultation@CID:"+consultation._id,doctor.practition);
                }
            });

            consultation.save(function (err) 
            {
                if (err)
                {
                  res.status(400).send("Not created");
                  return;
                }
                res.status(201)
                  .send("Created");
                return;
            });
        });
    },

    //======================================================================================
    //Function developed by: Steven Visser
    //get all the consultations for a specifc patient
    getPatientConsultations : function (req , res)
    {

        if (!req.user) //user is not logged in and un authorized to access the data
        {
            res.status(401).send("Unauthorized");
            return;
        }

        Consultation.find({"doctor":req.user, "patient":req.body.patient} , function(err, consultations)
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
    //Function developed by: Steven Visser
    //returns the name of the practice
    getPracticeName : function (req , res)
    {
        Practice.find({"_id":req.body.id} , function(err, prac)
        {
            if (err)
            {
                res.status(500)
                  .send("error geting practice");
                return;
            }
            else
            {
                res.status(200)
                  .json({"practice":prac.practice});
                return;
            }

        });
    },

    //======================================================================================
    //Function developed by: Steven Visser
    //returns the avatar choice of a doctor or receptionist
    getAvatarChoice : function (req , res)
    {
        Doctor.findOne({"_id":mongoose.Types.ObjectId(req.user)} , function(err, doc)
        {
            if (err)
            {
                res.status(500)
                  .send("error getting doctor");
                return;
            }
            if(doc != "" && doc != null)
            {
                res.status(200)
                  .json({"avatar":doc.avatar});
                return;
            }
        });

        Receptionist.findOne({"_id":mongoose.Types.ObjectId(req.user)} , function(err, rec)
        {
            if (err)
            {
                res.status(500)
                  .send("error getting doctor");
                return;
            }
            if(rec != "" && rec != null)
            {
                res.status(200)
                  .json({"avatar":rec.avatar});
                return;
            }
        });
    },

    //======================================================================================
    //Function developed by: Steven Visser
    //sets the avatar choice of a doctor or receptionist
    setAvatarChoice : function (req , res)
    {
        Doctor.findOneAndUpdate({"_id":mongoose.Types.ObjectId(req.user)}, {$set:{"avatar":req.body.avatar}} , function(err,doc)
        {
            if (err)
            {
              res.status(400)
                .send("Error Finding doctor");
              return;
            }
            if(doc != "" && doc != null)
            {
                res.status(200)
                .send("Doctor Updated!!");
              return;
            }
        });

        Receptionist.findOneAndUpdate({"_id":mongoose.Types.ObjectId(req.user)}, {$set:{"avatar":req.body.avatar}} , function(err,rec)
        {
            if (err)
            {
              res.status(400)
                .send("Error Finding receptionist");
              return;
            }
            if(rec != "" && rec != null)
            {
                res.status(200)
                    .send("Receptionist Updated!");
                return;
            }
        });
    },

    //======================================================================================
    //Function developed by: Steven Visser
    //returns a patient and the booking
    getPatientAndBooking: function (req, res) 
    {
        if (!req.user)
        {
            res.status(401)
                .send("Unauthorized access to doctors scheduling info");
            return;
        }

        Booking.findOne({"_id":mongoose.Types.ObjectId(req.body.bid)},function(err,bookings)
        {
            if(err)
            {
                res.status(400)
                    .send("error finding doctors bookings");
                return;
            }
            Patient.findOne({ '_id' : mongoose.Types.ObjectId(bookings.patient) }, function (err, patient)
            {
                if (err) 
                {
                    res.send(err);
                    return;
                }
                res.json({"name":patient.name,"idNumber":patient.idNumber,"time":bookings.time,"date":bookings.date,"cellnumber":patient.cellnumber,"patient":bookings.patient,"bid":bookings._id});
                return;  
            });
            
        });
    },

};

//============================================================================================
// Function developed by: Jacobus Janse van Rensburg 
// Function sends a email to head receptionist to confirm / reject a user signing up
function sendsignupConfirmationEmail(practice , user){

    console.log("HeadReceptionistEmail: "+ practice.headReceptionist);
    var emailOptions={
        from: 'flap.jacks.cs@gmail.com',
            to:practice.headReceptionist,//send email to the head receptionist
            subject: '3D Model Confirm User',
            html:''
    }

    //set the emails html properties
    emailOptions.html+='<div id="head" style="background-color: #003366; width: 500px; text-align: center; border-radius: 5px;margin: 0 auto; margin-top: 100px; box-shadow: 1px 0px 15px 0px black;"><br>';
    emailOptions.html+='<h2 style="color:white;">Enable Email Access</h2><hr style="background-color: white;">';
    emailOptions.html+='<span id="words" style="color: white;"> The email: <p style="color: lightblue;"id="emailAPI" name="emailAPI">xxxxxx@gmail.com</p>USER_NAME_HERE USER_SURNAME_HERE USER_ID_HERE Would like to signup with the system. <br> Would you like to <b style="color: lightgreen;">ACCEPT</b> or <b style="color: red;">REJECT</b> the request?</span>';
    emailOptions.html+='<br><br><a style="margin: 5px; color:white;" class="btn btn-success"  id="acceptSignup" name="acceptSignup"  href="ACCEPT_HREF" >ACCEPT</a>';
    emailOptions.html+='<a style="margin: 5px; color: white;" class="btn btn-danger" id="rejectSignup" name="rejectSignup" href="REJECT_HREF"><b>REJECT</b></a><br><br></div>';

    //populate the email with the appropriate information 

    emailOptions.html = emailOptions.html.replace('xxxxxx@gmail.com',user.email); //show the receptionist the email that wants to sign up
    emailOptions.html = emailOptions.html.replace('USER_NAME_HERE',user.name); //show the receptionist the email that wants to sign up
    emailOptions.html = emailOptions.html.replace('USER_SURNAME_HERE',user.surname);
    emailOptions.html = emailOptions.html.replace('USER_ID_HERE',user.id);

    //fill the information on the a click actions
    //do href to a page with the information url encoded to be extracted on that page and take nescasary actions
    // var href ="localhost:3000/ValidateSignup.html";

    var href ="https://flapjacks.goodx.co.za/ValidateSignup.html";
    //create url encoded hrefs
    var reject = href+"?action=reject&user="+user._id;
    var accept = href+"?action=accept&user="+user._id;
    //place hrefs in appropriate spots
    emailOptions.html = emailOptions.html.replace('REJECT_HREF',reject);
    emailOptions.html = emailOptions.html.replace('ACCEPT_HREF',accept);

    //send the email
    transporter.sendMail(emailOptions, function(error, info){
        if(error)
        {
            console.log(error);
        }
        else{
            console.log(info);
        }
    });
}

function updateLogFile(linedesc,practice)
{
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth()+1) +'/'+ today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var time = hours + ":" + minutes + ":" + seconds ;
    var line = date + "@" + time + "@" + linedesc + "\n";
    var fname = "./webSite/Logs/"+practice+".txt";
    fs.appendFile(fname,line,function(err)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            //console.log("Log updated.");
        }
    });
}

//==============================================================================================
//Function developed by: Jacobus Janse van Rensburg
//Function used to send a booking delete email
async function deletedBookingEmail(booking){

    var patient = await Patient.findOne({'_id': mongoose.Types.ObjectId(booking.patient)})
    var doctor = await Doctor.findOne({'_id':mongoose.Types.ObjectId(booking.doctor)})
    var emailOptions={
        from: 'flap.jacks.cs@gmail.com',
            to:patient.email,//send email to the head receptionist
            subject: '3D Model Booking Canceled',
            html:''
    }
    
    var htmlreplace ="<div id='head' style='background-color: #003366; width: 500px; text-align: center; border-radius: 5px;margin: 0 auto; margin-top: 100px; box-shadow: 1px 0px 15px 0px black;'><br>";
    htmlreplace+="<h2 style='color:white;'>Canceled Appointment</h2><hr style='background-color: white;'><span id='words' style='color: white;'>";
    htmlreplace+="For email: <p style='color: lightblue;' id='emailAPI' name='emailAPI'>xxxxxx@gmail.com</p> <p style='color: red; font-size: 20px;'>Alert!</p>Your appointment has been successfully canceled at date <p id='newDate' style='color: lightgreen;'>DATE_HERE</p> at <p >TIME_HERE</p> With Doctor <p id='docName' style='color: lightgreen;'>DOC_NAME_HERE</p></span><br><br></div>";

    htmlreplace =htmlreplace.replace("xxxxxx@gmail.com",patient.email);
    htmlreplace = htmlreplace.replace("DATE_HERE",booking.date);
    htmlreplace =htmlreplace.replace("DOC_NAME_HERE","("+doctor.name+") "+doctor.surname);
    httmlreplace= httmlreplace.replace("TIME_HERE",booking.time);

    emailOptions.html = htmlreplace;

    transporter.sendMail(emailOptions, function(error, info){
        if(error)
        {
            console.log(error);
        }
        else{
            console.log(info);
        }
    });
}

//===============================================================================================
//Function developed by: Jacobus Janse van Rensburg
//function used to send email to patient about changes to the booking 
async function updateBookingEmail(booking){

    var patient = await Patient.findOne({'_id':mongoose.Types.ObjectId(booking.patient)});
    var doctor  = await Doctor.findOne({'_id':mongoose.Types.ObjectId(booking.doctor)});

    var emailOptions={
        from: 'flap.jacks.cs@gmail.com',
            to:patient.email,//send email to the head receptionist
            subject: '3D Model Booking Changed',
            html:''
    }

    var htmlreplace = "<body><div id='head' style='background-color: #003366; width: 500px; text-align: center; border-radius: 5px; margin: 0 auto; margin-top: 100px; box-shadow: 1px 0px 15px 0px black;'><br><h2 style='color:white;'>Postponed Appointment</h2><hr style='background-color: white;'>";
    htmlreplace += "<span id='words' style='color: white;'> For email: <p style='color: lightblue;' id='emailAPI' name='emailAPI'>EMAIL_REPlACE</p> Your booking has successfully been postponed!<br>";
    htmlreplace += "<p>Your new booking date is on </p><p id='newDate' style='color: lightgreen;'>DATE_REPLACE</p> At <p style='color: lightgreen;'>TIME_REPLACE</p> With Doctor <p id='docName' style='color: lightgreen;'>DOC_REPLACE</p><p></p></span><br><br></div></body>";

    htmlreplace=htmlreplace.replace("EMAIL_REPLACE",patient.email);
    htmlreplace=htmlreplace.replace("DATE_REPLACE",booking.date);
    htmlreplace=htmlreplace.replace("DOC_REPLACE","("+doctor.name+") "+doctor.surname);
    htmlreplace=htmlreplace.replace("TIME_REPLACE",booking.time);
    
    emailOptions.html = htmlreplace;

    transporter.sendMail(emailOptions, function(error, info){
        if(error)
        {
            console.log(error);
        }
        else{
            console.log(info);
        }
    });    
}

//===============================================================================================
//Function developed by: Jacobus Janse van Rensburg && Steven Viser
//function to send teminder emails to the patients that have bookings comming up in the near future
setInterval(reminder,86400000);

async function reminder()
{
    var bookings = await Booking.find();

    for (var i in bookings)
    {
        var sendEmail= determineIfSendEmail(booking[i].date);

        //if sendEmail is true send an email for this booking
        if(sendEmail.send)
        {
            sendReminderEmail(booking[i],sendEmail.days);
        }
            
    }

    
}


function determineIfSendEmail(date)
{
    //node that date is a string "dd/mm/yyyy"
    var today = new Date();
    var d1 = today.getDate() + '/' + (today.getMonth()+1) +'/'+ today.getFullYear();

    //format yyy/mm/dd
    var newformat =  today.getFullYear() + '/' + (today.getMonth()+1) +'/'+ today.getDate();
    var todayDate = new Date(newformat);
    //add 3 days to the date
    var nextWeek = new Date(todayDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    //construct the new date string
    var d2 =  nextWeek.getDate() + '/' + (nextWeek.getMonth()+1) +'/'+ nextWeek.getFullYear();

    if(date == d1 || date == d2)
    {
        var ret = 
        {
            send: true,
            days: 0    
        }
        return ret;
    }
    else
    {
        var ret = 
        {
            send: false,
            days: 3    
        }
        return ret;
    }
}

async function sendReminderEmail(booking,days)
{
    var patient = await Patient.findOne({'_id':mongoose.Types.ObjectId(booking.patient)});
    var doctor = await Doctor.findOne({'_id':mongoose.Types.ObjectId(booking.doctor)});


    var emailOptions=
    {
        from: 'flap.jacks.cs@gmail.com',
        to:patient.email,//send email to the head receptionist
        subject: 'Reminder: Dental Appointment Today',
        html:''
    }

    var htmlreplace = "<body><div id='head' style='background-color: #003366; width: 500px; text-align: center; border-radius: 5px; margin: 0 auto; margin-top: 100px; box-shadow: 1px 0px 15px 0px black;'><br><h2 style='color:white;'>Reminder for Appointment</h2><hr style='background-color: white;'>";
    htmlreplace+="<span id='words' style='color: white;'> For email: <p style='color: lightblue;' id='emailAPI' name='emailAPI'>EMAIL_REPLACE</p> <p style='color: red; font-size: 20px;'>Reminder!</p><br><p>Your booking date is on </p><p id='newDate' style='color: lightgreen;'>DATE_REPLACENT</p> at <p style='color: lightgreen;'>TIME_REPLACE</p> With Doctor <p id='docName' style='color: lightgreen;'>DOC_REPLACEMENT</p><p></p></span><br><br></div></body>";

    htmlreplace = htmlreplace.replace("EMAIL_REPLACEMENT",patient.email);
    htmlreplace = htmlreplace.replace("DATE_REPLACEMENT",booking.date);
    htmlreplace = htmlreplace.replace("DOC_REPLACEMENT","("+doctor.name+") " + doctor.surname);
    htmlreplace = htmlreplace.replace("TIME_REPLACE",booking.time);

    emailOptions.html = htmlreplace;

    transporter.sendMail(emailOptions, function(error, info)
    {
        if(error)
        {
            console.log(error);
        }
        else
        {
            console.log(info);
        }
    }); 
}