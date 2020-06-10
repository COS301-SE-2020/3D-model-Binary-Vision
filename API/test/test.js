let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let db = require("../api/controller/3DModelController");

//Assertion sytle
chai.should();

chai.use(chaiHttp);

describe('API unit testing:', () => {
	// Test case 1 : Signup
	describe('Sign Up:', () => {
		it('Testing create new user (should return html page)', (done) => {
			const tempUser = {
				name: "Peter",
				surname: "Piper",
				username: "DrPP", 
				password: "12345"
			};
			chai.request("http://localhost:3000")
				.post("/signup". db.signup)
				.send(tempUser)
				.end((error, response) => {
					response.should.be.a('object');
				done();
				})
		});
	});
	// Test case 2 : Login
	describe('Login:', () => {
		it('Testing Login feature (returns error)', (done) => {
			const tempLogin = {
				username: "DrPP",
				password: "12345"
			};
			chai.request("http://localhost:3000")
				.post("/login", db.login)
				.send(tempLogin)
				.end((error, response) => {
					response.should.have.status(404);
				done();
				});
		});
	});
	// Test case 3 : Add Patient
	describe('Add Patient:', () => {

	});
	// Test case 4 : Get Single Patient
	describe('Get Single Patient:', () => {

	});
	// Test case 5 : Get Patients
	describe('Get Patients:', () => {

	});
	// Test case 6 : Update Patients
	describe('Update Patients:', () => {

	});
	// Test case 7 : Upload
	describe('Upload:', () => {

	});
});
