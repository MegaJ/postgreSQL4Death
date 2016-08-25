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
		handleQuery(req, res);
});



module.exports = router;
