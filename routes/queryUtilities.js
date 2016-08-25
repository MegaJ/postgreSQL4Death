var pool = require('../pgConnPool');

var handleQuery = function(req, res) {

	var body = req.body;
	switch(body.type) {
		case 'Save':
			// TODO: Save query. NOTE: You will have to set up another 
			// database user who will be able to SELECT / UPDATE / DELETE / INSERT users
			// on a users table. Thus, may need another module to connect to my database
			//queryUsersDB(req, res, body.query, customizeSaveResult);
			break;
		case 'Delete':
			// TODO: Delete the query from the user's saved queries
			//queryUsersDB(req, res, body.query, customizeDeleteResult);
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

var handleError = function (err, res) {
			console.log("Error from queryUtilities.js: ", err);
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
 		fn MUST use the (result) function signature. 
		Currently performs closure on 'customize-' functions
**/
var closeFunctionOnRes = function(res, fn) {
	return function (err, dbResult) {
		if(err) return handleError(err, res);

		var customizedJSON = fn(dbResult);
		res.setHeader('Content-Type', 'application/json');
		res.send(customizedJSON);	
	}
}

/** This one just builds a formatted json so front end can get fields 
		such as rows, cols, rowCount, colCount. I may want to add a type field
		so that front end can have logic for different behavior:
		Example: Flash a message that said save complete
**/
var customizeTestRunResult = function(dbResult) {
	var resultJSON = buildTableResults(dbResult);
	resultJSON.type = 'Test Run';
	return resultJSON;
}

var customizeRunResult = function(dbResult) {
	var resultJSON = customizeTestRunResult(dbResult);
	resultJSON.type = 'Run';
	//TODO: Now add stuff to resultJSON for the canvas
	return resultJSON;
}

var customizeSaveResult = function(dbResult) {
	//TODO: Fill in
		return {type: 'Save',
						 msg: 'Save complete!'}
}

var customizeDeleteResult = function(dbResult) {
	//TODO: Fill in
	return {type: 'Delete',
					 msg: 'Delete successful!'}
}

var queryDB = function(req, res, query, callback) {
	console.log("Query: ", query);
	pool.query(query, closeFunctionOnRes(res, callback));
}

var queryUsersDB = function(req, res, query, callback) {
	console.log("Users query: ", query);
	// TODO: Implement
	// userPool.query(query, closeFunctionOnRes(res, callback));
}


//TODO: If the query returns too many rows, I need to truncate output
var buildTableResults = function(dbResult) {

	var rowCount = dbResult.rowCount;
	var colCount = dbResult.fields.length;
	var rows = dbResult.rows;
	var colNames = [];

	for(var i = 0; i < dbResult.fields.length; i++ ) {
		colNames[i] = dbResult.fields[i].name;
	}

	var results = {
									rows: rows,
									cols: colNames,
									rowCount: rowCount,
									colCount: colCount
								}

	return results;
}

module.exports = handleQuery;
