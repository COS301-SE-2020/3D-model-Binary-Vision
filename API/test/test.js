let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let db = require("../api/controller/3DModelController");

//Assertion sytle
chai.should();

chai.use(chaiHttp);

describe('API unit testing:', () => {
	// Test 1 : Login
	describe('Login:', () => {
		it('Testing Login feature', (done) => {
			const tempLogin = {
				username: "MrDoc",
				password: "12345"
			};
		});
		chai.request(server)
			.post()
			.send(tempLogin)
			.end((error, response) => {
				response.should.have.status(404);
			done();
			});
	});
});