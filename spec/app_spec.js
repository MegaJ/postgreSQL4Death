var request = require("request");
var app = require("../app.js");
var base_url = "http://localhost:7000/";

describe("app", function () {
	describe("GET /", function() {
		it("returns status code 200", function(doneCB) {
			request.get(base_url, function(err, res, body) {
        expect(res.statusCode).toBe(210);
        doneCB();
      });
    });
	});
});
