var express = require('express');
var router = express.Router();
var pool = require('../pgConnPool');

/* GET home page. */
router.get('/', function (req, res) {

    res.render('index.jade', {
        layout: false,
    });
});

/** Expects client to send a application/json request **/
router.post('/', function (req, res) {
    
		/** So CONFUSING!: This line below DOES NOT throw a Reference Error. Just says Post 
		500 Server Error. If it's in other places, I can get the reference error. 
		What is up with the logging?
		**/
		//console.log(reqBody); 
		handleQuery(req, res);

});

var handleError = function (err, res) {
			console.log(err);
			console.log("Line number: ", err.line);

			/** TODO: There seems to be nothing in the err object
					that gives you the correct line number. It gives the position
					of where it thinks the error occurred though, so I can
					count the number of newline chars.

					Consider handling this on client side
			**/
			res.setHeader('Content-Type', 'application/json');
			res.send({err: err.message});
}

/** This function is ONLY called as a database callback, and uses fn as another callback.
 		fn MUST use the (err, result) function signature
		TODO: Enforce this restriction somehow. At least add some error handling
		at the top level of the function
**/
var closeFunctionOnRes = function(res, fn) {
	return function (err, dbResult) {
		if(err) return handleError(err, res);

		var customizedJSON = fn(err, dbResult);
		res.setHeader('Content-Type', 'application/json');
		res.send(customizedJSON);	
	}
}

var handleQuery = function(req, res) {

	var body = req.body;
	switch(body.type) {
		case 'Save':
			// TODO: Save query
			break;
		case 'Delete':
			// TODO: Delete the query from the user's saved queries
			break;
		case 'Test Run':
			queryDB(req, res, body.query, customizeTestRunResult);
			break;
		case 'Run':
			queryDB(req, res, body.query, customizeRunResult);
			// TODO: Define what to pass back to client for canvas interaction
			// do that inside customizeRunResult which can send JSON 
			// and let front end do logic based on JSON.
			break;
		default:
			// TODO: Handle this on front end later
			console.log("Invalid button action requested");
			res.setHeader('Content-Type', 'application/json');
			res.send({err: "Invalid button action requested"});
	}

};

//TODO: If the query returns too many rows, I need to truncate output
var buildTableResults = function(err, result) {

	var rowCount = result.rowCount;
	var colCount = result.fields.length;
	var rows = result.rows;
	var colNames = [];

	for(var i = 0; i < result.fields.length; i++ ) {
		colNames[i] = result.fields[i].name;
	}

	var results = {
									rows: rows,
									cols: colNames,
									rowCount: rowCount,
									colCount: colCount
								}

	return results;
}

/** This one just builds a formatted json so front end can get fields 
		such as rows, cols, rowCount, colCount. I may want to add a type field
		so that front end can have logic for different behavior:
		Example: Flash a message that said save complete
**/
var customizeTestRunResult = function(err, dbResult) {
	var resultJSON = buildTableResults(err, dbResult);
	return resultJSON;
}

var customizeRunResult = function(err, dbResult) {
	var resultJSON = customizeTestRunResult(err, dbResult);
	//TODO: Now add stuff to resultJSON for the canvas
	return resultJSON;
}

var customizeSaveResult = function(err, dbResult) {
	//TODO: Fill in
}

var customizeDeleteResult = function(err, dbResult) {
	//TODO: Fill in
}

var queryDB = function(req, res, query, callback) {
	console.log("Query: ", query);
	pool.query(query, closeFunctionOnRes(res, callback));
}


module.exports = router;
