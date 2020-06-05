'use strict';

const fs = require("fs");

var Model = require('../controller/3DModelController');
module.exports = function (app)
{

    //routes depending on the header
    app.route('/login')
        .get((_res, res) => {
            const page = fs.readFileSync("login.html", "utf-8");
            res.setHeader("Content-Type", "text/html");
            res.send(page);
        })
        .post(Model.login);

    app.route('/signup')
        .get((_res, res) => {
            const page = fs.readFileSync("signup.html", "utf-8");
            res.setHeader("Content-Type", "text/html");
            res.send(page);
        })
        .post(Model.signup);

    //handle get put delete
    app.route('/patients')
        .put(Model.addPatient);

    app.route('/patients')
        .get(Model.getPatients);

    app.route('/patients/:id')
        .get(Model.getSinglePatient)
        .patch(Model.updatePatient);

    app.route('/upload')
        .get((_res, res) => {
            const page = fs.readFileSync("upload.html", "utf-8");
            res.setHeader("Content-Type", "text/html");
            res.send(page);
        })
        .post(Model.upload);

    // app.route('/Media')
        // .post(Model.uploadedMedia);

}
