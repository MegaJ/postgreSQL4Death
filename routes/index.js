var express = require('express');
var router = express.Router();
var pool = require('../pgConnPool');

/* GET home page. */
router.get('/', function (req, res) {

    res.render('index.jade', {
        layout: false,
    });
});

router.post('/', function (req, res) {
    //analyze what's given from user
 
		var rows;
		pool.query(req.body.query, function(err, result) {
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
        
				res.render('index.jade', {
        	layout: false,
					rows: rows,
					rowCount: rowCount,
					colCount: colCount
    		}); // end render 
      
    });
    
    
}); // end POST

module.exports = router;
