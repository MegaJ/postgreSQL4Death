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
    
 		console.log("body: ", req.body);
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
				rows = JSON.stringify(result.rows);
				colCount = result.fields.length;
			}

			res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(rows));
			// how send row count and column count?
        
			/**	res.render('index.jade', {
        	layout: false,
					rows: rows,
					rowCount: rowCount,
					colCount: colCount
    		}); 
			**/
      
    });
    
    
}); // end POST

module.exports = router;
