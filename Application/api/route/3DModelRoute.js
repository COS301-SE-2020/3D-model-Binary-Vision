'use strict';

const fs = require("fs");

var Model = require('../controller/3DModelController');
var Emailer = require('../controller/EmailController');

module.exports = function (app)
{

    //routes depending on the header

    app.route('').get((_res, res) => {
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


    app.route('/patients')
        .post(Model.getPatients);
    //handle get put delete
    app.route('/addPatient')
        .post(Model.addPatient)
        .get((_res, res) => {
            const page = fs.readFileSync("addPatient.html", "utf-8");
            res.setHeader("Content-Type", "text/html");
            res.send(page);
        });


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
        .get(Model.getPatientConsultations);

    app.route('/logout')
        .post(Model.logout);

    app.route('/email')
        .post(Emailer.passwordChangeEmail);

    
}
