//File created by: Marcus Werren
// This file contains all of the integration tests for the api

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let db = require("../api/controller/3DModelController");
let dbR = require("../api/controller/ReceptionistController");
let dbE = require("../api/controller/EmailController");

var async = require('async');

//Assertion sytle
chai.should();
chai.use(chaiHttp);

// The agents
var doctor1 = chai.request.agent(server);
var doctor2 = chai.request.agent(server); // This doctor will not get logged in or created
var receptionist1 = chai.request.agent(server);
var receptionist2 = chai.request.agent(server); // This receptionist will not get logged in or created

var loggedDoc1;
var loggedRecep1;
/*
describe('Integration Testing:', () => {

	// Before all of the test are executed
	before(function(done) {
		// Create Doctor 1
		doc1 = {
			name: "Peter",
			surname: "Parker",
			email: "PeterParker@gmail.com",
			username: "DrSpiderman", 
			password: "1234",
			choice: "Doctor",
			practition: "Dentists For Hire",
			securityCode: "12345"
		};

		// Create Receptionist 1
		recep1 = {
			name: "Linda",
			surname: "Smith",
			email: "LindaSmith@gmail.com",
			username: "lindaS", 
			password: "4321",
			choice: "Receptionist",
			practition: "Dentists For Hire",
			securityCode: "12345"
		};

		prac1 = {
			practice: "Dentists For Hire",
			securityCode: "12345",
			headReceptionist: "LindaSmith@gmail.com"
		};

		// Create the practice 
		function registerPracticePrac1(cb) {
			receptionist1
				.post("/registerPractice", db.practiceRegistration)
				.send(prac1)
				.end((error, response) => {
					if (error) throw error;
					//signUpRecep1.call(null, cb);
					//signUpDoc1.call(null, cb);
					
					//response.should.have.status(200);
					//response.should.have.html;
					cb();
				});
		};//

		// Signup and login Doctor 1
		function signUpDoc1(cb) {
			doctor1
				.post("/signup", db.signup)
				.send(doc1)
				.end((error, response) => {
					if (error) throw error;
					response.should.have.status(200);
					response.should.have.html;
					
					isValidUsernameDoc1.call(null, cb);
					isValidEmailDoc1.call(null, cb);

					loginDoc1.call(null, cb);
				});
		};

		function isValidUsernameDoc1(cb) {
			doctor1
				.post("/isValidUsername", db.isValidUsername)
				.send({username: doc1.username})
				.end((error, response) => {
					if (error) throw error;
					response.should.have.status(422);
					response.should.have.json;
				});
		};

		function isValidEmailDoc1(cb) {
			doctor1
				.post("/isValidEmail", db.isValidEmail)
				.send({email: doc1.email})
				.end((error, response) => {
					if (error) throw error;
					response.should.have.status(422);
					response.should.have.json;
				});
		}

		function loginDoc1(cb) {
			doctor1
				.post("/login", db.login)
				.send({
					username: doc1.username,
					password: doc1.password
				})
				.end((error, response) => {
					if (error) throw error;
					response.should.have.status(200);
					loggedDoc1 = response.body;
					cb();
				});
		};

		// Signup and login Receptionist 1
		function signUpRecep1(cb) {
			receptionist1
				.post("/signup", db.signup)
				.send(recep1)
				.end((error, response) => {
					if (error) throw error;
					response.should.have.status(200);

					isValidUsernameRecep1.call(null, cb);
					isValidEmailRecep1.call(null, cb);

					loginRecep1.call(null, cb);
				});
		};

		function isValidUsernameRecep1(cb) {
			receptionist1
				.post("/isValidUsername", db.isValidUsername)
				.send({username: recep1.username})
				.end((error, response) => {
					if (error) throw error;
					response.should.have.status(422);
					response.should.have.json;
				});
		};

		function isValidEmailRecep1(cb) {
			receptionist1
				.post("/isValidEmail", db.isValidEmail)
				.send({email: recep1.email})
				.end((error, response) => {
					if (error) throw error;
					response.should.have.status(422);
					response.should.have.json;
				});
		}

		function loginRecep1(cb) {
			receptionist1
				.post("/login", db.login)
				.send({
					username: recep1.username,
					password: recep1.password
				})
				.end((error, response) => {
					if (error) throw error;
					response.should.have.status(200);
					loggedRecep1 = response.body;
					cb();
				});
		};

		async.series([
			function(cb) {
				registerPracticePrac1(cb);
			},
			function(cb) {
				signUpDoc1(cb);
			}, 
			function(cb) {
				signUpRecep1(cb);
			}
		], done);
	});

	// After all of the tests are executed
	after(function(done) {
		done();
	});

	// Test case 1: practiceRegistration
	describe('(1) practiceRegistration: ', () => {
		it('Testing Registration for a practice (With practice that already exists) - Returns 404 code', (done) => {
			const tempPracRegInfo = {
				practice: "Dentists For Hire",
				securityCode: "12345",
				headReceptionist: "LindaSmith@gmail.com"
			};

			chai.request(server)
				.post("/registerPractice", db.practiceRegistration)
				.send(tempPracRegInfo)
				.end((error, response) => {
					response.should.have.status(400);
					done();
				});
		});
	});

	// Test case 2: Signup
	describe('(2) SignUp:', () => {
		it('Testing Signup for a Doctor (With wrong practice name) - Returns 404 code', (done) => {
			const tempDoctor = {
				name: "Otto",
				surname: "Octavius",
				email: "DoctorOctopus@gmail.com",
				username: "DocOc", 
				password: "1234",
				choice: "Doctor",
				practition: "Wrong Practice Name",
				securityCode: "12345"
			};

			chai.request(server)
				.post("/signup", db.signup)
				.send(tempDoctor)
				.end((error, response) => {
					response.should.have.status(404);
					done();
				});
		});

		it('Testing Signup for a Doctor (With wrong practice security code) - Returns 401 code', (done) => {
			const tempDoctor = {
				name: "Otto",
				surname: "Octavius",
				email: "DoctorOctopus@gmail.com",
				username: "DocOc", 
				password: "1234",
				choice: "Doctor",
				practition: "Dentists For Hire",
				securityCode: "54321"
			};

			chai.request(server)
				.post("/signup", db.signup)
				.send(tempDoctor)
				.end((error, response) => {
					response.should.have.status(401);
					done();
				});
		});
//////////////////////////////////////////////////////////
		it('Testing Signup for a Doctor (With no input) - Returns 401 code', (done) => {
			const tempDoctor = {
				name: "Otto",
				surname: "Octavius",
				email: "DoctorOctopus",
				username: "DocOc", 
				password: "1234",
				choice: "Doctor",
				practition: "Dentists For Hire",
				securityCode: "12345"
			};

			chai.request(server)
				.post("/signup", db.signup)
				.send(tempDoctor)
				.then((response, body) => {
					response.should.have.status(400);
					done();
				});
		});

		it('Testing Signup for a Receptionist (With no input) - Returns 401 code', (done) => {
			const tempDoctor = {
				name: "Carolyn",
				surname: "Trainer",
				email: "CarolynTrainer",
				username: "CarolT", 
				password: "1234",
				choice: "Receptionist",
				practition: "Dentists For Hire",
				securityCode: "12345"
			};

			chai.request(server)
				.post("/signup", db.signup)
				.send(tempDoctor)
				.then((response, body) => {
					response.should.have.status(400);
					done();
				});
		});
//////////////////////////////////////////////////////////
	});
	
	// Test case 3 : Login
	describe('(3) Login:', () => {
//////////////////////////////////////////////////////////
		it ('Testing loging with doctor (With incorrect username) - Returns 401 code', (done) => {	
			const loginDetailsDoctor = {
				username: "spiderman", 
				password: "1234"
			};

			doctor1
				.post("/login", db.login)
				.send(loginDetailsDoctor)
				.end((error, response) => {
					response.should.have.status(401);
					done();
				});
		});

		it ('Testing loging with doctor (With incorrect password) - Returns 401 code', (done) => {	
			const loginDetailsDoctor = {
				username: "DrSpiderman", 
				password: "4321"
			};

			doctor1
				.post("/login", db.login)
				.send(loginDetailsDoctor)
				.end((error, response) => {
					response.should.have.status(401);
					done();
				});
		});
//////////////////////////////////////////////////////////
	});

	// Test case 4 : passwordChangeEmail
	describe('(4) Change the password with email', () => {
		it('Tetsing passwordChangeEmail Feature for receptionist (With valid user input) - Returns 200 code', (done) => {
			receptionist1
				.post("/passwordChangeEmail", dbE.passwordChangeEmail)
				.send({email: "LindaSmith@gmail.com"})
				.end((error, response) => {
					response.should.have.status(200);
				done();
				})
		});

		it('Tetsing passwordChangeEmail Feature for doctor (With valid user input) - Returns 200 code', (done) => {
			doctor1
				.post("/passwordChangeEmail", dbE.passwordChangeEmail)
				.send({email: "PeterParker@gmail.com"})
				.end((error, response) => {
					response.should.have.status(200);
				done();
				})
		});

		it('Tetsing passwordChangeEmail Feature for doctor (With invald email) - Returns 400 code', (done) => {
			doctor1
				.post("/passwordChangeEmail", dbE.passwordChangeEmail)
				.send({email: "testtesttest@gmail.com"})
				.end((error, response) => {
					response.should.have.status(400);
				done();
				})
		});
	});

	// Test case 5 : getReceptionistInfo
	describe('(5) Get the receptionists information', () => {
		// Testing a successful get rep info
		it('Testing Get Receptionist Info Feature (With valid input) - Returns 200 code', (done) => {
			receptionist1
				.post("/getReceptionist", dbR.getReceptionistInfo)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				})
		});

		it('Testing Get Receptionist Info Feature (With no user found) - Returns 401 code', (done) => {
			receptionist2
				.post("/getReceptionist", dbR.getReceptionistInfo)
				.end((error, response) => {
					response.should.have.status(401);
				done();
				})
		});
	});

	// Test case 6 : saveNotes
	describe('(6) Save the receptionists note', () => {
		// Testing a successful save receptionists notes
		it('Testing Save Notes Feature (With valid input) - Returns 200 code', (done) => {
			receptionist1
				.post('/saveReceptionistNotes', dbR.saveNotes)
				.send(receptionist1.body)
				.end((error, response) => {
					response.should.have.status(200);
				done();
				});
		});

		it('Testing Save Notes Feature (With no user found) - Returns 401 code', (done) => {
			receptionist2
				.post('/saveReceptionistNotes', dbR.saveNotes)
				.send(receptionist2.body)
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		});
	});

	// Test case 7 : getNotes
	describe('(7) Get the receptionists note', () => {
		// Testing a successful get receptionists notes
		it('Testing Get Notes Feature (With valid input) - Returns 200 code', (done) => {
			receptionist1
				.post('/getReceptionistNotes', dbR.getNotes)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				});
		}); // NOT WORKING ... retuing 401 ... user not found ... need to fix this some how.

		it('Testing Get Notes Feature (With no user found) - Returns 401 code', (done) => {
			receptionist2
				.post('/getReceptionistNotes', dbR.getNotes)
				.send(receptionist2.body)
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		});
	});

	// Test case 8 : addPatient
	describe('(8) Add a patient', () => {
		// Test add patient with success
		it ('Testing addPatient Feature (With valid user info) - Returns 200 code', (done) => {
			const tempPatient = {
				idNumber: "123456789",
				name: "Mark",
				surname: "Smith",
				email: "MarkSmith@gmail.com",
				gender: "male",
				cellnumber: "0764219334"
			};
			receptionist1
				.post("/addPatient", db.addPatient)
				.send(tempPatient)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.html;
					done();
				});
		});

		// Test add patient wiht failure
		it ('Testing addPatient Feature (With no user found) - Returns 401 code', (done) => {
			const tempPatient = {
				idNumber: "123456789",
				name: "Mark",
				surname: "Smith",
				email: "MarkSmith@gmail.com",
				gender: "male",
				cellnumber: "0764219334"
			};
			receptionist2	
				.post("/addPatient", db.addPatient)
				.send(tempPatient)
				.end((error, response) => {
					response.should.have.status(401);
					done();
				});
		});
	});

	// Test case 9 : selectPatient
	describe('(9) Select a patient', () => {
		// Test select a patient successfully
		it ('Testing selectPatient Feature (With valid user input) - Returns 200 code', (done) => {
			receptionist1
				.post("/selectPatient", db.selectPatient)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					done();
				});
		});

		it ('Testing selectPatient Feature (With no user found) - Returns 404 code', (done) => {
			receptionist2
				.post("/selectPatient", db.selectPatient)
				.send()
				.end((error, response) => {
					response.should.have.status(404);
					done();
				});
		});
	});

	// Test casse 10 : getSinglePatient
	describe('(10) Get a single patient', () => {
		// Test select a patient successfully
		it ('Testing getSinglePatient Feature (With valid user input) - Returns 200 code', (done) => {
			const tempPatientID = {
				idNumber: "123456789"
			};
			receptionist1
				.post("/singlePatient", db.getSinglePatient)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.have.json;
					done();
				});
		});
	});

	// Test case 11 : getPatients
	describe('(11) Get patients', () => {
		// Test get all patients
		it ('Testing getPatients Feature (With valid user input) - Returns 202 code', (done) => {
			receptionist1
				.post("/patients", db.getPatients)
				.send()
				.end((error, response) => {
					response.should.have.status(202);
					response.should.have.json;
					done();
				});
		});

		it ('Testing getPatients Feature (With no user found) - Returns 401 code', (done) => {
			receptionist2
				.post("/patients", db.getPatients)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
					done();
				});
		});
	});

	// Test case 12 : updatePatient
	describe('(12) Update Patient', () => {
		// Test update a patient success
//////////////////////////////////////////////////////////
		it ('Testing updatePatient Feature (With valid user input) - Returns 201 code', (done) => {
			const tempPatientID = {
				idNumber: "123456789"
			};
			receptionist1
				.patch("/patients/:" + 123456789, db.updatePatient)
				.send(tempPatientID)
				.end((error, response) => {
					response.should.have.status(201);
					response.should.have.json;
					done();
				});
		});
//////////////////////////////////////////////////////////

		// Test update a patient failure
		it ('Testing updatePatient Feature (With invalid user input) - Returns 404 code', (done) => {
			const tempPatientID = {
				idNumber: "123456789"
			};
			receptionist2
				.patch("/patients/:" + 123456789, db.updatePatient)
				.send(tempPatientID)
				.end((error, response) => {
					response.should.have.status(404);
					done();
				});
		}); 
	});

	// Test case 13: makeBooking
	describe('(13) Make a booking for a patient', () => {
//////////////////////////////////////////////////////////
		it('Testing makeBooking Feature (With valid user input) - Returns 200 code', (done) => {
			const bookingInfo = {
				patient: "Mark",
				doctor: "Peter",
				time: "12:30",
				date: "12/12/2020",
				reason: "Checkup"
			};
			receptionist1
				.post('/makeBooking', dbR.makeBooking)
				.send(bookingInfo)
				.end((error, response) => {
					response.should.have.status(400);
					response.should.be.html;
				done();
				});
		});
//////////////////////////////////////////////////////////

		it('Testing makeBooking Feature (With invalid user input) - Returns 400 code', (done) => {
			const bookingInfo = {
				patient: "Mark",
				doctor: "Peter",
				time: "12:30",
				date: "12/12/2020",
				reason: "Checkup"
			};
			receptionist1
				.post('/makeBooking', dbR.makeBooking)
				.send(bookingInfo)
				.end((error, response) => {
					response.should.have.status(400);
				done();
				});
		});

		it('Testing makeBooking Feature (With no user) - Returns 401 code', (done) => {
			const bookingInfo = {
				patient: "Mark",
				doctor: "Peter",
				time: "12:30",
				date: "12/12/2020",
				reason: "Checkup"
			};
			receptionist2
				.post('/makeBooking', dbR.makeBooking)
				.send(bookingInfo)
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		});
	});

	// Test case 14 : getPatientConsultations
	describe('(14) Get Patient Consoltation', () => {
		it ('Testing getPatientConsultations Feature (With vaild user input) - Returns 200 code', (done) => {
			doctor1
				.get("/consultations", db.getPatientConsultations)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.have.json;
					done();
				});
		});

		it ('Testing getPatientConsultations Feature (With no user found) - Returns 404 code', (done) => {
			doctor2
				.get("/consultations", db.getPatientConsultations)
				.end((error, response) => {
					response.should.have.status(404);
					done();
				});
		});
	});

	// Test case 15 : selectConsultation
	describe('(15) Select a consultation', () => {

		it ('Testing selectConsultation Feature (With valid user input) - Returns 200 code', (done) => {
			doctor1
				.post("/consultations", db.selectConsultation)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					done();
				});
		});

		it ('Testing selectConsultation Feature (With no user found) - Returns 401 code', (done) => {
			doctor2
				.post("/consultations", db.selectConsultation)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
					done();
				});
		});
	});

	// Test case 16 : retrieveConsultationFiles
	describe('(16) Retrieve a consultation', () => {
		
		it('Testing retrieveConsultationFiles Feature (With no consultation found) - Returns 404 code', (done) => {
			doctor1
				.get('/stlConsultation', db.retrieveConsultationFiles)
				.end((error, response) => {
					response.should.have.status(500);
					response
				done();
				});
		})

		it('Testing retrieveConsultationFiles Feature (Wit no user found) - Returns 401 code', (done) => {
			doctor2
				.get('/stlConsultation', db.retrieveConsultationFiles)
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		})
	});

	// Test case 17 : getDoctorSurname
	describe('(17) Get the doctors surname', () => {
		// Test get the doctors surname success
		it ('Testing getDoctorSurname Feature (With valid user) - Returns Json response', (done) => {
			doctor1
				.post("/getDoctor", db.getDoctorSurname)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
					done();
				});
		});

		it ('Testing getDoctorSurname Feature (With no user found) - Returns 401 code', (done) => {
			doctor2
				.post("/getDoctor", db.getDoctorSurname)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
					done();
				});
		});
	});

	// Test case 18 : upload
	describe('(18) Upload a video', () => {
		// Test to upload video footage for the backend
//////////////////////////////////////////////////////////
		it('Testing upload Feature (With no data) - Returns 400 code', (done) => {
			doctor1
				.post('/upload', db.upload)
				.send()
				.end((error, response) => {
					response.should.have.status(400);
				done();
				});
		});
//////////////////////////////////////////////////////////
	});

	// Test case 19 : STLConsultationUpload
	describe('(19) Upload an STL file', () => {
		// Test to upload STL file to be rendered
//////////////////////////////////////////////////////////
		it('Testing STLConsultationUpload Feature (With valid user input) - Returns 200 code', (done) => {
			doctor1
				.post('/stlConsultation', db.STLConsultationUpload)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
				done();
				});
		});
//////////////////////////////////////////////////////////
	});

	// Test case 20 : getAllDoctors
	describe('(20) Get all the doctors ', () => {
		it('Testing getAllDoctors Feature (With valid user input) - Returns Json', (done) => {
			receptionist1
				.post('/getAllDoctors', dbR.getAllDoctors)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.have.json;
				done();
				});
		});

		it('Testing getAllDoctors Feature (With no user found) - Returns 401 code', (done) => {
			receptionist2
				.post('/getAllDoctors', dbR.getAllDoctors)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		});
	});

	// Test case 21 : getDoctors
	describe('(21) Get Doctors', () => {
		it('Testing getDoctors Feature (With valid user input) - Returns 200 code', (done) => {
			receptionist1
				.post('/getDoctorsOfReceptionist', dbR.getDoctors)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.have.json;
				done();
				});
		});

		it('Testing getDoctors Feature (With no user found) - Returns 401 code', (done) => {
			receptionist2
				.post('/getDoctorsOfReceptionist', dbR.getDoctors)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		});
	});

	// Test case 22 : getDoctorsSchedule
	describe('(22) Get a doctors schedule', () => {
		it('Tesing getDoctorsSchedule Feature (With valid user input) - Returns 200', (done) => {
			receptionist1
				.post('/getDoctorsTimetable', dbR.getDoctorsSchedule)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.have.json;
				done();
				});
		});

		it('Tesing getDoctorsSchedule Feature (With no user found) - Returns 401', (done) => {
			receptionist2
				.post('/getDoctorsTimetable', dbR.getDoctorsSchedule)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		});
	});

	// Test case 23 : getDoctorScheduleToday
	describe('(23) Get a doctors schedule for today', () => {
		it('Testing getDoctorsSchedule Feature (With valid user input) - Returns Json', (done) => {
			doctor1
				.post('/getDoctorsScheduleToday', dbR.getDoctorScheduleToday)
				.send()
				.end((error, response) => {
					response.should.be.json;
				done();
				});
		});

		it('Testing getDoctorsSchedule Feature (With no user found) - Returns 401 code', (done) => {
			doctor2
				.post('/getDoctorsScheduleToday', dbR.getDoctorScheduleToday)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		});
	});

	// Test case 24 : getAllDoctors
	describe('(24) Get all the doctors', () => {
		// Test to get all of the doctors at the practition
		it('Testing getAllDoctors Feature (With valid user input) - Returns Json', (done) => {
			receptionist1
				.post('/getAllDoctors', db.getAllDoctors)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.have.json;
				done();
				});
		});

		it('Testing getAllDoctors Feature (With no user found) - Returns 401 code', (done) => {
			receptionist2
				.post('/getAllDoctors', db.getAllDoctors)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		});
	});

	// Test case 25 : getSingleDoctor
	describe('(25) Get a single doctor', () => {
//////////////////////////////////////////////////////////
		it('Testing getSingleDoctor Feature (With valid user input) - Returns 200 code', (done) => {
			receptionist1
				.post('/getSingleDoctor', db.getSingleDoctor)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.have.json;
					done();
				});
		});
//////////////////////////////////////////////////////////

		it('Testing getSingleDoctor Feature (With no user found) - Returns 401 code', (done) => {
			receptionist2
				.post('/getSingleDoctor', db.getSingleDoctor)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
					done();
				});
		});
	});

	// Test case 26 : getDoctorsBookings
	describe('(26) Get the doctors bookings', () => {

		it('Tesing getDoctorsBookings Feature (With valid user input) - Returns 200 code', (done) => {
			receptionist1
				.post('/getDoctorsBookings', db.getDoctorsBookings)
				.send()
				.end((error, response) => {
					response.should.be.status(200);
					response.should.have.json;
				done();
				});
		});

		it('Tesing getDoctorsBookings Feature (With no user found) - Returns 401 code', (done) => {
			receptionist2
				.post('/getDoctorsBookings', db.getDoctorsBookings)
				.send()
				.end((error, response) => {
					response.should.be.status(401);
				done();
				});
		});
	});

	// Test case 27 : searchPatient
	describe('(27) Search a Patient', () => {

		it('Testing searchPatient Feature (With search by all fields) - Returns json', (done) => {
			const patientInfo = {
				name: "Mark",
				surname: "Smith",
				idNumber: "123456789"
			};
			receptionist1
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				});
		});

		it('Testing searchPatient Feature (With search by id only) - Returns json', (done) => {
			const patientInfo = {
				name: null,
				surname: null,
				idNumber: "123456789"
			};
			receptionist1
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				});
		});

		it('Testing searchPatient Feature (With search by first name and surname only) - Returns json', (done) => {
			const patientInfo = {
				name: "Mark",
				surname: "Smith",
				idNumber: null
			};
			receptionist1
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				});
		});

		it('Testing searchPatient Feature (With search by first name only) - Returns json', (done) => {
			const patientInfo = {
				name: "Mark",
				surname: null,
				idNumber: null
			};
			receptionist1
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				});
		});

		it('Testing searchPatient Feature (With search by surname only) - Returns json', (done) => {
			const patientInfo = {
				name: null,
				surname: "Smith",
				idNumber: null
			};
			receptionist1
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				});
		});

		it('Testing searchPatient Feature (With invalid search input) - Returns 400 code', (done) => {
			const patientInfo = {
				name: null,
				surname: null,
				idNumber: null
			};
			receptionist1
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(400);
				done();
				});
		});
////////////////////////////////////////////////////////// 
		it('Testing searchPatient Feature (With search by all invalid fields) - Returns 404 code', (done) => {
			const patientInfo = {
				name: "Marcus",
				surname: "Werren",
				idNumber: "12345678"
			};
			receptionist1
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(404);
				done();
				});
		});

		it('Testing searchPatient Feature (With search by invalid id only) - Returns 404 code', (done) => {
			const patientInfo = {
				name: null,
				surname: null,
				idNumber: "12345678"
			};
			receptionist1
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(404);
				done();
				});
		});

		it('Testing searchPatient Feature (With search by invalid first name and surname only) - Returns 404 code', (done) => {
			const patientInfo = {
				name: "Marcus",
				surname: "Smith",
				idNumber: null
			};
			receptionist1
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(404);
				done();
				});
		});

		it('Testing searchPatient Feature (With search by first name and invalid surname only) - Returns 404 code', (done) => {
			const patientInfo = {
				name: "Mark",
				surname: "Werren",
				idNumber: null
			};
			receptionist1
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(404);
				done();
				});
		});

		it('Testing searchPatient Feature (With search by invalid first name only) - Returns 404 code', (done) => {
			const patientInfo = {
				name: "Marcus",
				surname: null,
				idNumber: null
			};
			receptionist1
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(404);
				done();
				});
		});

		it('Testing searchPatient Feature (With search by invalid surname only) - Returns 404 code', (done) => {
			const patientInfo = {
				name: null,
				surname: "Werren",
				idNumber: null
			};
			receptionist1
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(404);
				done();
				});
		});
////////////////////////////////////////////////////////// 
		it('Testing searchPatient Feature (With no user found) - Returns 401 code', (done) => {
			const patientInfo = {
				name: "Mark",
				surname: "Smith",
				idNumber: "123456789"
			};
			receptionist2
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		});
	});

	// Test case 28 : getTodaysBookings
	describe('(28) Get the booking for today', () => {

		it('Tesing getTodaysBookings Feature (With valid user input) - Returns 200 code', (done) => {
			receptionist1
				.post('/getTodaysBookings', db.getTodaysBookings)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				});
		});

		it('Tesing getTodaysBookings Feature (With no user found) - Returns 401 code', (done) => {
			receptionist2
				.post('/getTodaysBookings', db.getTodaysBookings)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		});
	});

	// Test case 29 : getSingleBooking
	describe('(29) Get a single booking', () => {
		it ('Testing getSingleBooking Feature (With valid user input) - Returns 200 code', (done) => {
			receptionist1
				.post('/getSingleBooking', db.getSingleBooking)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.have.json;
					done();
				});
		});

		it ('Testing getSingleBooking Feature (With no user found) - Returns 401 code', (done) => {
			receptionist2
				.post('/getSingleBooking', db.getSingleBooking)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
					done();
				});
		});
	})

	// Test case 30 : updateBooking
	describe('(30) Update a booking', () => {
		it('Testing updateBooking Feature (With valid user input) - Returns 200 code', (done) => {
			receptionist1
				.post('/postponeBooking', db.updateBooking)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
				done();
				});
		});

		it('Testing updateBooking Feature (With valid user input) - Returns 401 code', (done) => {
			receptionist2
				.post('/postponeBooking', db.updateBooking)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		});
	});

	// Test case 31 : removeBooking
	describe('(31) Remove a booking', () => {
		it('Tesing removeBooking Feature (With valid user input) - Returns 200 code', (done) => {
			receptionist1
				.post('/removeBooking', db.removeBooking)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
				done();
				});
		});

		it('Tesing removeBooking Feature (With no user found) - Returns 401 code', (done) => {
			receptionist2
				.post('/removeBooking', db.removeBooking)
				.send()
				.end((error, response) => {
					response.should.have.status(401);
				done();
				});
		});
	});

	// Test case 32 : resetPassord
	describe('(32) Reset Passord', () => {
//////////////////////////////////////////////////////////
		it('Testing resetPassord Feature (With valid user input) - Return 200 code', (done) => {
			const logingDetails = {
				email: "LindaSmith@gmail.com",
				password: "4321",
				code: "12345"
			};

			receptionist1
				.post('/resetPassord', db.resetPassord)
				.send(logingDetails)
				.end((error, response) => {
					response.should.have.status(200);
				done();
				});
		});
//////////////////////////////////////////////////////////
	});

	// Test case 33 : Logout
	describe('(33) Logout', () => {
		// Test a logout
		it('Testing Logout doctor Feature (From home page) - Returns the preview page', (done) => {
			doctor1
				.post("/logout", db.logout)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.html;
				done();
				});
		});

		// Test a logout
		it('Testing Logout receptionist Feature (From home page) - Returns the preview page', (done) => {
			receptionist2
				.post("/logout", db.logout)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.html;
				done();
				});
		});
	});
});
*/
