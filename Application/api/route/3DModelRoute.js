//Created by: Jacobus Janse van Rensburg
//Modified by: Steven Visser
//This file is used to set the routes of all of the specified calls in the front end to their respective
//partner in the API

'use strict';

const fs = require("fs");

//This sets the paths to each API Controller
var Model = require('../controller/3DModelController');
var Emailer = require('../controller/EmailController');
var Receptionist = require('../controller/ReceptionistController');

module.exports = function (app)
{

    //routes depending on the header

    app.route('')
        .get((_res, res) => {
            const page = fs.readFileSync("webSite/html/preview.html", "utf-8");
            res.setHeader("Content-Type", "text/html");
            res.send(page);
        });

    app.route('/login')
        .post(Model.login);

    app.route('/signup')
        .post(Model.signup);

    app.route('/getDoctor')
        .post(Model.getDoctorSurname);


    app.route('/patients').post(Model.getPatients);

    //handle get put delete
    app.route('/addPatient')
        .post(Model.addPatient);
        
    app.route("/singlePatient")
        .post(Model.getSinglePatient);

    app.route('/patients/:id')
        .post(Model.getSinglePatient)
        .patch(Model.updatePatient)
        .get(Model.getPatientConsultations);

    app.route('/selectPatient')
        .post(Model.selectPatient);

    app.route('/upload')
        .get((_res, res) => {
            const page = fs.readFileSync("webSite/html/upload.html", "utf-8");
            res.setHeader("Content-Type", "text/html");
            res.send(page);
        })
        .post(Model.upload);

    app.route('/consultations')
        .get(Model.getPatientConsultations)
        .post(Model.selectConsultation);

    app.route("/stlConsultation")
        .post(Model.STLConsultationUpload)
        .get(Model.retrieveConsultationFiles);

    app.route('/logout')
        .post(Model.logout);

    app.route('/email')
        .post(Emailer.passwordChangeEmail);

    app.route('/getReceptionist')   
        .post(Receptionist.getReceptionistInfo);

    app.route('/getReceptionistNotes')
        .post(Receptionist.getNotes);
    
    app.route('/saveReceptionistNotes')
        .post(Receptionist.saveNotes);

    app.route('/makeBooking')
        .post(Receptionist.makeBooking);

    app.route('/searchPatient')
        .post(Model.searchPatient);
    
    app.route('/getAllDoctors')
        .post(Model.getAllDoctors);

    app.route('/getDoctorsBookings')
        .post(Model.getDoctorsBookings);
    
    app.route('/getDoctorsTimetable')
        .post(Receptionist.getDoctorsSchedule);
    
    app.route('/getDoctorsScheduleToday')
        .post(Receptionist.getDoctorScheduleToday)

    app.route('/getDoctorsOfReceptionist')
        .post(Receptionist.getDoctors);
 
    app.route('/getTodaysBookings')
        .post(Model.getTodaysBookings);

    app.route('/removeBooking')
        .post(Model.removeBooking);

    app.route('/postponeBooking')
        .post(Model.updateBooking);
    
    app.route('/getSingleBooking').post(Model.getSingleBooking);
}
