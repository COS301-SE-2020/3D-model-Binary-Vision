let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let db = require("../api/controller/3DModelController");

//Assertion sytle
chai.should();

chai.use(chaiHttp);

describe('API unit testing:', () => {

// Test case 7: Signup
	describe('SignUp:', () => {
		it('Testing create new user', (done) => {
			const tempUser = {
				name: "test",
				surname: "test",
				username: "test", 
				password: "test"
			};
			chai.request("localhost:3000")
				.post("/signup", db.signup)
				.send(tempUser)
				.end((error, response) => {
					response.should.have.status(201);
				done();
				})
		});
		it('Testing create new user (return error)', (done) => {
			const tempUser = {
			};
			chai.request("localhost:3000")
				.post("/signup", db.signup)
				.send(tempUser)
				.end((error, response) => {
					response.should.have.status(200);
				done();
				})
		});
	});
	// Test case 1 : Login
	describe('Login:', () => {
		// Test a successful login
		it('Testing Login feature (return success: code 202)', (done) => {
			const tempLogin = {
				username: "test",
				password: "test"
			};
			chai.request("http://localhost:3000")
				.post("/login", db.login)
				.send(tempLogin)
				.end((error, response) => {
					response.should.have.status(202);
				done();
				});
		});


		// Test an unsuccessful login
		it('Testing Login feature (returns failure: code 404)', (done) => {
			const tempLogin = {
				username: "test",
				password: "test1234"
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
	// Test case 2 : Add Patient
	/*describe('Patient:', () => {
		it( 'Testing Add Patient',(done)=> {
			const tempPatient = {
				idNumber: '9901018763456',
				name: 'Mr',
				surname: 'Test'
			};		
			chai.request("localhost:3000")
				.post("/signup", db.addPatient)
				.send(tempPatient)
				.end((error, response) => {
					response.should.have.status(202);
				done();
				});
		});
		it( 'Testing Get Single Patient',(done)=> {
			chai.request("localhost:3000")
				.post("/displayPatients", db.getSinglePatient)
				.send("9901076785643")
				.end((error, response) => {
					response.should.have.status(200);
				done();
				});				
		});
		it( 'Testing Get Single Patient (return error)',(done)=> {
			chai.request("localhost:3000")
				.post("/signup", db.getSinglePatient)
				.send("9901076785643")
				.end((error, response) => {
					response.should.have.status(404);
				done();
				});				
		});
		it( 'Testing Get Patients',(done)=> {
			
		});
	});*/
	// Test case 5 : Update Patients
	describe('Update Patients:', () => {

	});
	// Test case 6 : Upload
	describe('Upload:', () => {

	});
	
});
