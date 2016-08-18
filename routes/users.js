var express = require('express');
var router = express.Router();
var pool = require('../pgConnPool');

/* GET users listing. */
router.get('/', function (req, res) {
  pool.query("$$select * from country_codes where name like '%a'", function(err, result) {
      // handle an error from the query
      if(err) {
        console.log(err.message, err.stack);
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('ERROR: ' + err);
      } else {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('Query result: ' + JSON.stringify(result.rows));
      }
    });
});

module.exports = router;
