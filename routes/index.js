var express = require('express');
var router = express.Router();
var pool = require('../pgConnPool');

/* GET home page. */
router.get('/', function (req, res) {

    res.render('index.jade', {
        layout: false,
    });
});

var handleError = function (err, res) {
			console.log(err.message, err.stack);
			res.setHeader('Content-Type', 'application/json');
			res.send({err: err.message});
}

/** Expects client to send a text/plain request **/
router.post('/', function (req, res) {
    
		//TODO: If the query returns too many rows, I need to truncate output
		var rows;

		pool.query(req.body, function(err, result) {

      if(err) return handleError(err, res);
      
			rowCount = result.rowCount;
			colCount = result.fields.length;
			rows = result.rows;
		

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
			res.setHeader('Content-Type', 'application/json');
			res.send(results);
	  	//res.send(JSON.stringify(results));
    });
    
    
}); // end POST

module.exports = router;
