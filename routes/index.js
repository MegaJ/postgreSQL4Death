var express = require('express');
var router = express.Router();
var pool = require('../pgConnPool');

/* GET home page. */
router.get('/', function (req, res) {

    res.render('index.jade', {
        layout: false,
    });
});

/** Expects client to send a text/plain request **/
router.post('/', function (req, res) {
    
		//TODO: If the query returns too many rows, I need to truncate output
		var rows;
		pool.query(req.body, function(err, result) {
      // handle an error from the query
      if(err) {
        console.log(err.message, err.stack);
				rows = err;
				colCount = 0;
				rowCount = 0;
      } else {
				rowCount = result.rowCount;
				colCount = result.fields.length;
				rows = JSON.stringify(result.rows);
			}
			
			var results = {
											rows: rows,
											rowCount: rowCount,
											colCount: colCount
										}
			res.setHeader('Content-Type', 'application/json');
			res.send(results);
    	//res.send(JSON.stringify(results));      
    });
    
    
}); // end POST

module.exports = router;
