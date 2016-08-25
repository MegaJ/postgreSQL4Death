var express = require('express');
var router = express.Router();
var handleQuery = require('./queryUtilities');

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



module.exports = router;
