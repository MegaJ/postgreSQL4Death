var request = require("request");
var app = require("../app.js");
var base_url = "http://localhost:7000/";

//Button fire type strings
var ts = {
	testRun : 'Test Run',
	run : 'Run',
	save : 'Save',
	del : 'Delete'
}

var tableNames = ['avail_mortality', 'avail_pop', 'country_codes',
							'morticd7', 'notes', 'population'];
 

describe("app", function () {
	describe("GET /", function() {
		it("returns status code 200", function(doneCB) {
			request.get(base_url, function(err, res, body) {
        expect(res.statusCode).toBe(200);
        doneCB();
      });
    });
	});

	describe("POST /", function() {
		describe("Existence of WHO Database tables", function() {
			for (var i = 0; i < tableNames.length; i++) {
				var currTable = tableNames[i];

				it(currTable, function(doneCB) {
					request.post({
						headers: {'content-type' : 'application/json'},
						url:    	base_url,
						form : { // huh, would've thought the key would be body
							type: ts.testRun,
							query: 'Select * from ' + currTable + ' limit 1',
							queryName: 'test'
						}
					}, function(err, res, stringifiedJSON){
						var data = JSON.parse(stringifiedJSON);
						expect(data.err).toBe(undefined);
						expect(data.rows.length).toBe(1);
						doneCB();
					}); // end post
				}); // end it
			}// end for
		}); // end WHO tables

		describe("UI Buttons", function () {
			it("Refuses to accept posts from buttons with unspecified values", function(doneCB) {
				request.post({
					headers: {'content-type' : 'application/json'},
					url:    	base_url,
					form : {
						type: 'Update', // not defined in ts variable in this file
						query: 'Select * from country_codes limit 1',
						queryName: 'test'
					}
				}, function(err, res, stringifiedJSON){
					var data = JSON.parse(stringifiedJSON);
					expect(data.err).toBeDefined();
					doneCB();
				}); // end request post
			}) // end it
		}) // end describe UI
		
	}); // end describe POST
});
