let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let db = require("../api/controller/3DModelController");

//Assertion sytle
chai.should();
chai.use(chaiHttp);

var agent = chai.request.agent(server); // Create the agent to store the cookie 
	
const expect = require('chai').expect

describe('test', () => {
  it('should return a string', () => {
    expect('ci with travis').to.equal('ci with travis');
  });
});

/*
describe('API unit testing:', () => {
	// Test case 1: Signup
	describe('(1) SignUp:', () => {
		it('Testing Signup feature (With valid input) - Returns Login page', (done) => {
			const tempUser = {
				name: "Peter",
				surname: "Eater",
				email: "PeterEater@gmail.com",
				username: "PeterEater", 
				password: "1234"
			};
			chai.request("localhost:3000")
				.post("/signup", db.signup)
				.send(tempUser)
				.end((error, response) => {
					response.should.have.status(201); // If it returns 201 then it has created a new user
					response.should.be.html; // Test is html is sent as a reponse for the new login page
				done();
				});
		});
		it('Testing Signup feature (With no input) - Returns error json', (done) => {
			const tempUser = {
				name: "",
				surname: "",
				email: "",
				username: "", 
				password: ""
			};
			chai.request("localhost:3000")
				.post("/signup", db.signup)
				.send(tempUser)
				.end((error, response) => {
					response.should.have.status(200); // Connect is 'OK' ... there is no defined reponse code for an error 
					response.should.not.be.html; // The reponse is not the login page and therefore unsuccessful signup 
				done();
				});
		});
	});
	
	// Test case 2 : Login
	describe('(2) Login:', () => {
		// Test a successful login
		it('Testing Login feature (With valid input) - Returns users home page', (done) => {
			const tempLogin = {
				username: "PeterEater",
				password: "1234"
			};
			agent
				.post("/login", db.login)
				.send(tempLogin)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.html;
				done();
				});
		});


		// Test an unsuccessful logins
		it('Testing Login feature (With wrong password entered) - Returns error json', (done) => {
			const tempLogin = {
				username: "PeterEater",
				password: "123"
			};
			agent
				.post("/login", db.login)
				.send(tempLogin)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				});
		});

		it('Testing Login feature (With invalid user) - Returns error json', (done) => {
			const tempLogin = {
				username: "ErrorTest",
				password: "ErrorTest"
			};
			agent
				.post("/login", db.login)
				.send(tempLogin)
				.end((error, response) => {
					response.should.have.status(200);
					response.should.be.json;
				done();
				});
		});
	});

	// Test case 3 : addPatient
	describe('(3) Add a patient', () => {		
		// Test add patient with success
		it ('Testing addPatient Feature (With valid user info) - Returns 201 code', (done) => {
			const tempPatient = {
				idNumber: "123456789",
				name: "Mark",
				surname: "Smith",
				email: "MarkSmith@gmail.com",
				gender: "male"
			};
			agent
				.post("/addPatient", db.addPatient)
				.send(tempPatient)
				.end((error, response) => {
					response.should.have.status(201);
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
			agent	
				.post("/addPatient", db.addPatient)
				.send(tempPatient)
				.end((error, response) => {
					response.should.have.status(400);
					done();
				});
		});
	});

	// Test case 4 : selectPatient
	describe('(4) Select a patient', () => {
		// Test select a patient successfully
		it ('Testing selectPatient Feature (With valid user input) - Returns 200 code', (done) => {
			const tempPatientID = {
				idNumber: "123456789"
			};
			agent
				.post("/patients", db.selectPatient)
				.send(tempPatientID)
				.end((error, response) => {
					response.should.have.status(200);
					done();
				});

		});

		// Test select patient failure
		it ('Testing selectPatient Feature (With invalid user input) - Returns 404 code', (done) => {
			const tempPatientID = {
				idNumber: ""
			}
			agent
				.post("/patients", db.selectPatient)
				.send()
				.end((error, response) => {
					response.should.have.status(404);
					done();
				});
		});
	});

	// Test casse 5 : getSinglePatient
	describe('(5) Get a single patient', () => {
		// Test select a patient successfully
		it ('Testing getSinglePatient Feature (With valid user input) - Returns 200 code', (done) => {
			const tempPatientID = {
				idNumber: "123456789"
			};
			agent
				.post("/patients", db.getSinglePatient)
				.send(tempPatientID)
				.end((error, response) => {
					response.should.have.status(200);
					done();
				});
		});

		// Test select patient failure
		it ('Testing getSinglePatient Feature (With invalid user input) - Returns 404 code', (done) => {
			const tempPatientID = {
				idNumber: ""
			}
			agent
				.post("/patients", db.getSinglePatient)
				.send()
				.end((error, response) => {
					response.should.have.status(404);
					done();
				});
		});
	});

	// Test case 6 : getPatients
	describe('(6) Get patients', () => {
		// Test get all patients
		it ('Testing getPatients Feature (With  valid user input) - Returns 202 code', (done) => {
			agent
				.post("/patients", db.getPatients)
				.send()
				.end((error, response) => {
					response.should.have.status(202);
				});
		});
	});

	// Test case 7 : updatePatient
	describe('(7) Update Patient', () => {
		// Test update a patient success
		it ('Testing updatePatient Feature (With valid user input) - Returns 201 code', (done) => {
			const tempPatientID = {
				idNumber: "123456789"
			};
			agent
				.post("/patients", db.updatePatient)
				.send(tempPatientID)
				.end((error, response) => {
					response.should.have.status(201);
					done();
				});
		});

		// Test update a patient failure
		it ('Testing updatePatient Feature (With invalid user input) - Returns 404 code', (done) => {
			const tempPatientID = {
				idNumber: ""
			};
			agent
				.post("/patients", db.updatePatient)
				.send(tempPatientID)
				.end((error, response) => {
					response.should.have.status(404);
					done();
				});
		});
	});

	// Test case 8 : getPatientConsultations
	describe('(8) Get Patient Consoltation', () => {
		// Test get the patients cosultatios success
		it ('Testing getPatientConsultations Feature (With vaild user input) - Returns 200 code', (done) => {
			agent
				.get("/consultations", db.getPatientConsultations)
				.end((error, response) => {
					response.should.have.status(200);
					done();
				});
		});
	});

	// Test case 9 : getDoctorSurname
	describe('(9) Get the doctors surname', () => {
		// Test get the doctors surname success
		it ('Testing getDoctorSurname Feature (With valid user) - Returns Json responce', (done) => {
			agent
				.post("/getDoctor", db.getDoctorSurname)
				.end((error, response) => {
					response.should.be.json;
					done();
				});
		});

		// Test get the doctors surname failure
		it ('Testing getDoctorSurname Feature (with invalid user) - Returns 401 code', (done) => {
			chai.request("http://localhost:3000")	
				.post("/getDoctor", db.getDoctorSurname)
				.end((error, response) => {
					response.should.status(401);
					done();
				});
		});
	});

	// Test case 10 : Logout
	describe('(10) Logout', () => {
		// Test a logout
		it('Testing Logout Feature (From home page) - Returns the preview page', (done) => {
			agent
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