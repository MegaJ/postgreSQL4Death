var pg = require('pg');
var Pool = pg.Pool;
var fs = require('fs');

var userAndPass = fs.readFileSync('./dbuser.txt', 'utf8');
var re = /(.*)\n(.*)\n(.*)/;
var matches = userAndPass.match(re);

var config = {
  host: 'localhost', // change later
  user: matches[1],
  password: matches[2],
  database: matches[3]
};

// create the pool somewhere globally so its lifetime
// lasts for as long as your app is running
var pool = new Pool(config);

process.on('unhandledRejection', function(e) {
  console.log(e.message, e.stack)
})

pg.on('error', function (err) {
  console.log('Database error!', err);
});

module.exports = pool;

