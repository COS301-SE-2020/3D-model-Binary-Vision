//File created by: Marcus Werren
// This file contains all of the unit tests for the api

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let db = require("../api/controller/3DModelController");

var async = require('async');

//Assertion sytle
chai.should();
chai.use(chaiHttp);

"use strict";

var fs = require("fs");
const bcrypt = require('bcrypt');
const { createModel } = require('mongoose-gridfs');
var formidable = require("formidable");
var mongoose = require("mongoose");
var qrCode = require('qrcode');

var Doctor = require("../api/model/3DModelModel.js").Doctor;
var Patient = require("../api/model/3DModelModel.js").Patient;
var Consultation = require("../api/model/3DModelModel.js").Consultation;
var Receptionist = require("../api/model/3DModelModel.js").Receptionist;
var Booking = require("../api/model/3DModelModel.js").Booking;
var PasswordChanges = require("../api/model/3DModelModel.js").PasswordChanges;
var Practice = require("../api/model/3DModelModel.js").Practice;

//Email modules and settings to send emails
var nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport({
	host:"smtp.mailtrap.io",
	port: 2525,
	auth:{
		user:"0c9f2b08034ef4",
		pass:"c1fd4b36bbc842"
	} 
 });

const frontsalt ="Lala";
const  backSalt = "Bey";

// Doctors
const doc1 = {
	name: "Peter",
	surname: "Parker",
	email: "PeterParker@gmail.com",
	username: "DrSpiderman", 
	password: "1234",
	choice: "Doctor",
	practition: "Dentists For Hire",
	securityCode: "12345"
};

const doc2 = {
	name: "Otto",
	surname: "Octavius",
	email: "DocOc@gmail.com",
	username: "DocOc", 
	password: "12345",
	choice: "Doctor",
	practition: "123 Dentists",
	securityCode: "8689"
};

// Receptionists
const recep1 = {
	name: "Linda",
	surname: "Smith",
	email: "LindaSmith@gmail.com",
	username: "lindaS", 
	password: "4321",
	choice: "Receptionist",
	practition: "Dentists For Hire",
	securityCode: "12345"
};

const recep2 = {
	name: "Carolyn",
	surname: "Trainer",
	email: "LadyOctopus@gmail.com",
	username: "LadyOctopus", 
	password: "54321",
	choice: "Receptionist",
	practition: "123 Dentists",
	securityCode: "8689"
};


// Practices
const prac1 = {
	practice: "Dentists For Hire",
	securityCode: "12345",
	headReceptionist: "LindaSmith@gmail.com"
};

const prac2 = {
	practice: "123 Dentists",
	securityCode: "8689",
	headReceptionist: "123Dentists@gmail.com"
};

// Patients 
const patient1 = {
	idNumber: "987654321",
	name: "Luke",
	surname: "Skywalker",
	email: "LukeSky@gmail.com",
	gender: "male",
	cellnumber: "0769874764",
	practice: "123 Dentists"
};

var doc2_ID;
var recep2_ID;

describe('API unit testing:', () => {
	
	// Test case 1 : practiceRegistration
	describe('(1) practiceRegistration: ', () => {
		
		it('Find a registered practice', () => {
			const prac = Practice.findOne({
				"practice" : "Dentists For Hire"
			});
			prac.schema._requiredpaths.should.not.equal(undefined);
		});

		it('Register a practice', () => {
			const newPractice = new Practice(prac2);
			const prac = newPractice.save();
			prac.should.not.equal(undefined); 
		}); 
	});

	// Test case 2 : signup
	describe('(2) signup', () => {
		after(function(done) {
			function getDoc2ID(cb) {
				chai.request(server)
					.post("/isValidEmail", db.isValidEmail)
					.send({email: doc2.email})
					.end((error, response) => {
						if (error) throw error;
						response.should.have.status(422);
						response.should.have.json;

						doc2_ID = response.body._id;
						cb();
					});
			}


			function getRecep2ID(cb) {
				chai.request(server)
					.post("/isValidUsername", db.isValidUsername)
					.send({username: recep2.username})
					.end((error, response) => {
						if (error) throw error;
						response.should.have.status(422);
						response.should.have.json;

						recep2_ID = response.body._id;
						cb();
					});
			};

			async.series([
				function(cb) {
					getDoc2ID(cb);
				},
				function(cb) {
					getRecep2ID(cb);
				}
			], done);
		});

		it('Encrypt a password', () => {
			const saltedPass = frontsalt + doc1.password + backSalt;
			const pass = bcrypt.hash(saltedPass,10);

			pass.should.not.equal(undefined);
		});

		it('Sign up a new doctor', () => {
			const newDoc = new Doctor(doc2);
			const doc = newDoc.save();
			doc.should.not.equal(undefined);
		});

		it('Sign up a new receptionist', () => {
			const newRecep = new Receptionist(recep2);
			const recep = newRecep.save();
			recep.should.not.equal(undefined);
		});
	});

	// Test case 3 : login
	describe('(3) login', () => {
		it('Log a doctor in', () => {
			const doc = Doctor.findOne({ 
				"username": doc2.username , "active":true
			});
			doc.should.not.equal("undefined");
		});

		it('Log a receptionist in', () => {
			const recep = Receptionist.findOne({ 
				"username": recep2.username , "active":true
			});
			recep.should.not.equal("undefined");
		});
	});

	// Test case 4 : logout
	describe('(4) logout', () => {
		it('Log out a doctor', () => {
			const doc = Doctor.findOne({
				"_id":doc2_ID
			});
			doc.should.not.equal(undefined);
		});

		it('Log out a receptionist', () => {
			const recep = Receptionist.findOne({
				"_id":recep2_ID
			});
			recep.should.not.equal(undefined);
		});
	});

	// Test case 5 : isValidUsername
	describe('(5) isValidUsername', () => {
		it('Find a doctor', () => {
			const doc = Doctor.findOne({
				"username": doc2.username
			});
			doc.should.not.equal(undefined);
		});

		it('Find a receptionist', () => {
			const recep = Receptionist.findOne({
				"username": recep2.username
			});
			recep.should.not.equal(undefined);
		});
	});

	// Test case 6 : isValidEmail
	describe('(6) isValidEmail', () => {
		it('Find an email (doctor)', () => {
			const doc = Doctor.findOne({
				"email" : doc2.email
			});
			doc.should.not.equal(undefined);
		});

		it('Find an email (receptionist)', () => {
			const recep = Doctor.findOne({
				"email" : recep2.email
			});
			recep.should.not.equal(undefined);
		});
	});
/*
	// Test case 7 : selectPatient
	describe('(7) selectPatient', () => {
		it('NO FUNCTINS TO TEST', () => {

		});
	});
*/
	// Test case 8 : addPatient
	describe('(8) addPatient', () => {
		it('Add a new patient', () => {
			const newPatient = new Patient(patient1);
			const patient = newPatient.save();
			patient.should.not.equal(undefined);
		});
	});
/*
	// Test case 9 : getSinglePatient
	describe('(9) getSinglePatient', () => {
		it('PATIENT ID NEEDED', () => {

		});
	});
*/
	// Test case 10 : getPatients
	describe('(10) getPatients', () => {
		it('Get all patients', () => {
			const pat = Patient.find({
				'doctor': doc2_ID
			});
			pat.should.not.equal(undefined);
		});
	});
/*
	// Test case 11 : selectConsultation
	describe('(11) selectConsultation', () => {
		it('NO FUNCTION TO TEST', () => {

		});
	});

	// Test case 12 : retrieveConsultationFiles
	describe('(12) retrieveConsultationFiles', () => {
		it('CONSULTATION ID NEEDED', () => {

		});
	});
*/
	// Test case 13 : getDoctorSurname
	describe('(13) getDoctorSurname', () => {
		it('Get a doctors surname', () => {
			const doc = Doctor.findOne({
				"_id":doc2_ID
			});
			doc.should.not.equal(undefined);
		});
	});
/*
	// Test case 14 : upload
	describe('(14) upload', () => {
		it('PATIENT ID NEEDED', () => {

		});
	});

	// Test case 15: STLConsultationUpload
	describe('(15) STLConsultationUpload', () => {
		it('PATIENT ID NEEDED', () => {

		});
	});

	// Test case 16 : getSTLFile
	describe('(16) getSTLFile', () => {
		it('CONSULTATION ID NEEDED', () => {

		});
	});
*/
	// Test case 17 : getAllDoctors
	describe('(17) getAllDoctors', () => {
		it('Find all doctors', () => {
			const doc = Doctor.find({})
			doc.should.not.equal(undefined);
		});
	});

	// Test case 18 : getDoctorsBookings
	describe('(18) getDoctorsBookings', () => {
		it('Get a doctors bookings', () => {
			const doc = Booking.find({
				"doctor" : doc2_ID
			});
			doc.should.not.equal(undefined);
		});
	});

	// Test case 19 : searchPatient
	describe('(19) searchPatient', () => {
		it('Get pateint by idNumber and practice', () => {
			const patient = Patient.find({
				"idNumber":patient1.idNumber, "practice":prac1.practition
			});
			patient.should.not.equal(undefined);
		});

		it('Get pateint by name, surname and practice', () => {
			const patient = Patient.find({
				"name":patient1.name, "surname":patient1.surname, "practice":prac1.practition
			});         
			patient.should.not.equal(undefined);
		});

		it('Get pateint by name and practice', () => {
			const patient = Patient.find({
				"name":patient1.name, "practice":prac1.practition
			});         
			patient.should.not.equal(undefined);
		});

		it('Get pateint by surname and practice', () => {
			const patient = Patient.find({
				"surname":patient1.surname, "practice":prac1.practition
			});         
			patient.should.not.equal(undefined);
		});
	});

	// Test case 20 : getTodaysBookings
	describe('(20) getTodaysBookings', () => {
		it('Get bookings for today', () => {
			var date = new Date();
			var d = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear(); 

			const doc = Booking.find({
				"doctor": doc2_ID, "date":d
			});
			doc.should.not.equal(undefined);
		});
	});
/*
	// Test case 21 : removeBooking
	describe('(21) removeBooking', () => {
		it('BOOKING ID NEEDED', () => {

		});
	});
*/
	// Test case 22 : updateBooking
	describe('(22) updateBooking', () => {
		it('Receptionist update a booking', () => {
			const recep = Receptionist.findOne({
				"_id":recep2_ID
			});
			recep.should.not.equal(undefined);
		});

		it('Doctor update a booking', () => {
			const doc = Doctor.findOne({
				"_id":doc2_ID
			});
			doc.should.not.equal(undefined);
		});
	});
/*
	// Test case 23 : getSingleBooking
	describe('(23) getSingleBooking', () => {
		it('BOOKING ID NEEDED', () => {

		});
	});
*/
	// Test case 24 : getSingleDoctor
	describe('(24) getSingleDoctor', () => {
		it('Get a single doctor', () => {
			const doc = Doctor.findOne({
				"_id":doc2_ID
			});
			doc.should.not.equal(undefined);
		});
	});

	// Test case 25 : resetPassord
	describe('(25) resetPassord', () => {
		it('Recet a doctors password', () => {
			const newPassword = "192837465";
			const doc = Doctor.findOneAndUpdate (
				{"email":doc2.email},{$set:{"password":newPassword}
			});
			doc.should.not.equal(undefined);
		});

		it('Recet a receptionists password', () => {
			const newPassword = "192837465";
			const recep = Receptionist.findOneAndUpdate (
				{"email":recep2.email},{$set:{"password":newPassword}
			});
			recep.should.not.equal(undefined);
		});
	});

	// Test case 26 : activateUser
	describe('(26) activateUser', () => {
		it('Activate the doctor', () => {
			const doc = Doctor.findOneAndUpdate(
				{"_id":doc2_ID}, {$set:{"active":true}}
			);
			doc.should.not.equal(undefined);
		});

		it('Activate the receptionist', () => {
			const recep = Receptionist.findOneAndUpdate(
				{"_id":recep2_ID}, {$set:{"active":true}}
			);
			recep.should.not.equal(undefined);
		});
	});

	// Test case 27 : generatePatientSignupQRCode
	describe('(27) generatePatientSignupQRCode', () => {
		it('Get the doctor', () => {
			const doc = Doctor.findOne({
				"_id":doc2_ID
			});
			doc.should.not.equal(undefined);
		});

		it('Get the receptionist', () => {
			const recep = Receptionist.findOne({
				"_id":recep2_ID
			});
			recep.should.not.equal(undefined);
		});
	});
/*
	// Test case 28 : updateLog
	describe('(28) updateLog', () => {
		it('NO FUNCTION TO BE TESTED', () => {

		});
	});

	// Test case 29 : saveConsultation
	describe('(29) saveConsultation', () => {
		it('PATIENT and USER ID NEEDED', () => {

		});
	});

	// Test case 30 : getPatientConsultations
	describe('(30) getPatientConsultations', () => {
		it('USER and PATIENT ID NEEDED', () => {

		});
	});

	// Test case 31 : getPracticeName
	describe('(31) getPracticeName', () => {
		it('PRACTICE ID NEEDED', () => {

		});
	});
*/
	// Test case 32 : getAvatarChoice 
	describe('(32) getAvatarChoice', () => {
		it('Select for doctor', () => {
			const doc = Doctor.findOne({
				"_id":doc2_ID
			});
			doc.should.not.equal(undefined);
		});

		it('Select for receptionist', () => {
			const recep = Receptionist.findOne({
				"_id":recep2_ID
			});
			recep.should.not.equal(undefined);
		});
	});

	// Test case 33 : setAvatarChoice
	describe('(33) setAvatarChoice', () => {
		it('Set an avatar for a doctor', () => {
			const doc = Doctor.findOneAndUpdate(
				{"_id":doc2_ID}, {$set:{"avatar":"6"}}
			);
			doc.should.not.equal(undefined);
		});

		it('Set an avatar for a receptionist', () => {
			const recep = Receptionist.findOneAndUpdate(
				{"_id":recep2_ID}, {$set:{"avatar":"3"}}
			);
			recep.should.not.equal(undefined);
		});
	});
/*
	// Test case : 
	describe('() ', () => {
		it('', () => {

		});
	});
*/
});

