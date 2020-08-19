let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let db = require("../api/controller/3DModelController");
let dbR = require("../api/controller/ReceptionistController");

//Assertion sytle
chai.should();
chai.use(chaiHttp);

var doctor = chai.request.agent(server); // Create the agent to store the cookie 
var rep = chai.request.agent(server); // Create the agent to store the cookie 
	
describe('API unit testing:', () => {
	// Test case 1: Signup
	describe('(1) SignUp:', () => {
		// test successful signup
		it('Testing Signup doctor feature (With valid input) - Returns Login page', (done) => {
			const tempUser = {
				name: "Peter",
				surname: "Parker",
				email: "PeterParker@gmail.com",
				username: "DrSpiderman", 
				password: "1234",
				choice: "Doctor",
				practition: "Dentists For Hire"
			};
			doctor
				.post("/signup", db.signup)
				.send(tempUser)
				.end((error, response) => {
					response.should.have.status(200); // If it returns 201 then it has created a new user
					response.should.be.html; // Test is html is sent as a response for the new login page
				done();
				});
		});

		// test successful signup
		it('Testing Signup receptionist feature (With valid input) - Returns Login page', (done) => {
			const tempUser = {
				name: "Linda",
				surname: "Smith",
				email: "LindaSmith@gmail.com",
				username: "lindaS", 
				password: "4321",
				choice: "Receptionist",
				practition: "Dentists For Hire"
			};
			rep
				.post("/signup", db.signup)
				.send(tempUser)
				.end((error, response) => {
					response.should.have.status(200); // If it returns 201 then it has created a new user
					response.should.be.html; // Test is html is sent as a response for the new login page
				done();
				});
		});
	});
	
	// Test case 2 : Login
	describe('(2) Login:', () => {
		// Test a successful login
		it('Testing Login with doctor feature (With valid input) - Returns users home page', (done) => {
			const tempLogin = {
				username: "DrSpiderman",
				password: "1234"
			};
			doctor
				.post("/login", db.login)
				.send(tempLogin)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.html;
				done();
				});
		});

		// Test a successful login
		it('Testing Login with receptionist feature (With valid input) - Returns users home page', (done) => {
			const tempLogin = {
				username: "lindaS",
				password: "4321"
			};
			rep
				.post("/login", db.login)
				.send(tempLogin)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.html;
				done();
				});
		});
	});

	// Test case 3 : getReceptionistInfo
	describe('(3) Get the receptionists information', () => {
		// Testing a successful get rep info
		/*it('Testing Get Receptionist Info Feature (With valid input) - Returns 200 code', (done) => {
			rep
				.post("/getReceptionistInfo", dbR.getReceptionistInfo)
				.send("")
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				})
		});*/
	});

	// Test case 4 : saveNotes
	describe('(4) Save the receptionists note', () => {
		// Testing a successful save receptionists notes
		/*it('Testing Save Notes Feature (With valid input) - Returns 200 code', (done) => {
			rep
				.post('/saveReceptionistNotes', dbR.saveNotes)
				.send(rep.body)
				.end((error, response) => {
					response.should.have.status(200);
				done();
				});
		});*/
	});

	// Test case 5 : getNotes
	describe('(5) Get the receptionists note', () => {
		// Testing a successful get receptionists notes
		it('Testing Get Notes Feature (With valid input) - Returns 200 code', (done) => {
			rep
				.post('/getReceptionistNotes', dbR.getNotes)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				});
		});
	});

	// Test case 6 : addPatient
	describe('(6) Add a patient', () => {
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
			rep
				.post("/addPatient", db.addPatient)
				.send(tempPatient)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.html;
					done();
				});
		});

		// Test add patient wiht failure
		it ('Testing addPatient Feature (With invalid user input) - Returns 400 code', (done) => {
			const tempPatient = {
				idNumber: "",
				name: "",
				surname: "",
				email: "",
				gender: ""
			};
			rep	
				.post("/addPatient", db.addPatient)
				.send(tempPatient)
				.end((error, response) => {
					response.should.have.status(400);
					done();
				});
		});
	});

	// Test case 7 : selectPatient
	describe('(7) Select a patient', () => {
		// Test select a patient successfully
		it ('Testing selectPatient Feature (With valid user input) - Returns 200 code', (done) => {
			const tempPatientID = {
				idNumber: "123456789"
			};
			rep
				.post("/patients", db.selectPatient)
				.send(tempPatientID)
				.end((error, response) => {
					response.should.have.status(202);
					done();
				});

		});

		// Test select patient failure
		/*it ('Testing selectPatient Feature (With invalid user input) - Returns 404 code', (done) => {
			const tempPatientID = {
				idNumber: "123456789"
			}
			rep
				.post("/patients", db.selectPatient)
				.send(tempPatientID)
				.end((error, response) => {
					response.should.have.status(404);
					done();
				});
		});*/
	});

	// Test casse 8 : getSinglePatient
	describe('(8) Get a single patient', () => {
		// Test select a patient successfully
		it ('Testing getSinglePatient Feature (With valid user input) - Returns 200 code', (done) => {
			const tempPatientID = {
				idNumber: "123456789"
			};
			rep
				.post("/patients", db.getSinglePatient)
				.send(tempPatientID)
				.end((error, response) => {
					response.should.have.status(202);
					done();
				});
		});

		// Test select patient failure
		/*it ('Testing getSinglePatient Feature (With invalid user input) - Returns 404 code', (done) => {
			const tempPatientID = {
				idNumber: ""
			}
			rep
				.post("/patients", db.getSinglePatient)
				.send()
				.end((error, response) => {
					response.should.have.status(404);
					done();
				});
		});*/
	});

	// Test case 9 : getPatients
	describe('(9) Get patients', () => {
		// Test get all patients
		/*it ('Testing getPatients Feature (With  valid user input) - Returns 202 code', (done) => {
			rep
				.post("/patients", db.getPatients)
				.send("")
				.end((error, response) => {
					response.should.have.status(202);
				});
		});*/
	});

	// Test case 10 : updatePatient
	describe('(10) Update Patient', () => {
		// Test update a patient success
		it ('Testing updatePatient Feature (With valid user input) - Returns 201 code', (done) => {
			const tempPatientID = {
				idNumber: "123456789"
			};
			rep
				.post("/patients", db.updatePatient)
				.send(tempPatientID)
				.end((error, response) => {
					response.should.have.status(202);
					done();
				});
		});

		// Test update a patient failure
		/*it ('Testing updatePatient Feature (With invalid user input) - Returns 404 code', (done) => {
			const tempPatientID = {
				idNumber: ""
			};
			rep
				.post("/patients", db.updatePatient)
				.send(tempPatientID)
				.end((error, response) => {
					response.should.have.status(404); // ???????????????????????????????
					done();
				});
		});*/
	});

	// Test case 11: makeBooking
	describe('(11) Make a booking for a patient', () => {
		// Test making a booking for a patient
		/*it('Testing makeBooking Feature (With valid user input) - Returns 200 code', (done) => {
			const bookingInfo = {
				patient: "Mark",
				doctor: "Peter",
				time: "12:30",
				date: "12/12/2020",
				reason: "Checkup"
			};
			rep
				.post('/makeBooking', dbR.makeBooking)
				.send(bookingInfo)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.html;
				done();
				});
		});*/
	});

	// Test case 12 : getPatientConsultations
	describe('(12) Get Patient Consoltation', () => {
		// Test get the patients cosultatios success
		it ('Testing getPatientConsultations Feature (With vaild user input) - Returns 200 code', (done) => {
			rep
				.get("/consultations", db.getPatientConsultations)
				.end((error, response) => {
					response.should.have.status(200);
					done();
				});
		});
	});

	// Test case 13 : selectConsultation
	describe('(13) Select a consultation', () => {
		// Test select a consultation with success
		/*it ('Testing selectConsultation Feature (With valid user input) - Returns 200 code', (done) => {
			rep
				.post("/consultations", db.selectConsultation)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
				});
		});*/
	});

	// Test case 14 : retrieveConsultationFiles
	describe('(14) Retrieve a consultation', () => {
		// Test get a consultation
		it('Testing retrieveConsultationFiles Feature (Wit valid user input) - Returns Json', (done) => {
			rep
				.post('/consultations', db.retrieveConsultationFiles)
				.send()
				.end((error, response) => {
					response.should.be.html;
				done();
				});
		})
	});

	// Test case 15 : getDoctorSurname
	describe('(15) Get the doctors surname', () => {
		// Test get the doctors surname success
		it ('Testing getDoctorSurname Feature (With valid user) - Returns Json response', (done) => {
			doctor
				.post("/getDoctor", db.getDoctorSurname)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
					done();
				});
		});
	});

	// Test case 16 : upload
	describe('(16) Upload a video', () => {
		// Test to upload video footage for the backend
		/*it('Testing upload Feature (With valid user input) - Returns 201 code', (done) => {
			rep
				.post('/Consoltation', db.upload)
				.send()
				.end((error, response) => {
					response.should.have.status(201);
				done();
				});
		});*/
	});

	// Test case 17 : STLConsultationUpload
	describe('(17) Upload an STL file', () => {
		// Test to upload STL file to be rendered
		/*it('Testing STLConsultationUpload Feature (With valid user input) - Returns 200 code', (done) => {
			rep
				.post('/Render', db.STLConsultationUpload)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
				done();
				});
		});*/
	});

	// Test case 18 : getDoctors
	describe('(18) Get all the doctors ', () => {
		// Test to get all of the doctors at the practition
		it('Testing getDoctors Feature (With valid user input) - Returns Json', (done) => {
			rep
				.post('/getAllDoctors', dbR.getDoctors)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
				done();
				});
		});
	});

	// Test case 19 : getDoctorsSchedule
	describe('(19) Get a doctors schedule', () => {
		// Test to get the doctors schedules 
		it('Tesing getDoctorsSchedule Feature (With valid user input) - Returns 200', (done) => {
			rep
				.post('/getDoctorsSchedule', dbR.getDoctorsSchedule)
				.send()
				.end((error, response) => {
					response.should.be.html;
				done();
				});
		});
	});

	// Test case 20 : getDoctorScheduleToday
	describe('(20) Get a doctors schedule for today', () => {
		// Test to get the doctors schedule for today
		it('Testing getDoctorsSchedule Feature (With valid user input) - Returns Json', (done) => {
			rep
				.post('/getDoctorScheduleToday', dbR.getDoctorScheduleToday)
				.send()
				.end((error, response) => {
					response.should.be.html;
				done();
				});
		});
	});

	// Test case 21 : getAllDoctors
	describe('(21) Get all the doctors', () => {
		// Test to get all of the doctors at the practition
		it('Testing getAllDoctors Feature (With valid user input) - Returns Json', (done) => {
			rep
				.post('/getAllDoctors', db.getAllDoctors)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
				done();
				});
		});
	});

	// Test case 22 : getDoctorsBookings
	describe('(22) Get the doctors bookings', () => {
		// Test to get a doctors bookings 
		it('Tesing getDoctorsBookings Feature (With valid user input) - Returns 200 code', (done) => {
			rep
				.post('/getDoctorsBookings', db.getDoctorsBookings)
				.send()
				.end((error, response) => {
					response.should.be.status(200);
				done();
				});
		})
	});

	// Test case 23 : searchPatient
	describe('(23) Search a Patient', () => {
		// Test to search a patient
		it('Testing searchPatient Feature (With valid user input) - Returns json', (done) => {
			const patientInfo = {
				name: "Mark",
				surname: "Smith",
				idNumber: "123456789"
			};
			rep
				.post('/searchPatient', db.searchPatient)
				.send(patientInfo)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				});
		});
	});

	// Test case 24 : getTodaysBookings
	describe('(24) Get the booking for today', () => {
		// Test to get the bookings for today
		it('Tesing getTodaysBookings Feature (With valid user input) - Returns 200 code', (done) => {
			rep
				.post('/getTodaysBookings', db.getTodaysBookings)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				});
		});
	});

	// Test case 25 : removeBooking
	describe('(25) Remove a booking', () => {
		// test eemove a booking
		it('Tesing removeBooking Feature (With valid user input) - Returns 200 code', (done) => {
			rep
				.post('/removeBooking', db.removeBooking)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
				done();
				});
		});
	});

	// Test case 26 : updateBooking
	describe('(26) Update a booking', () => {
		// Test update a booking 
		/*it('Testing updateBooking Feature (With valid user input) - Returns 200 code', (done) => {
			rep
				.post('/updateBooking', db.updateBooking)
				.send()
				.end((error, response) => {
					response.should.have.status(200);
				done();
				});
		});*/
	});

	// Test case 27 : Logout
	describe('(27) Logout', () => {
		// Test a logout
		it('Testing Logout doctor Feature (From home page) - Returns the preview page', (done) => {
			rep
				.post("/logout", db.logout)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.html;
				done();
				});
		});

		// Test a logout
		it('Testing Logout receptionist Feature (From home page) - Returns the preview page', (done) => {
			rep
				.post("/logout", db.logout)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.html;
				done();
				});
		});
	});
});

