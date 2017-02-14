const async = require('async');


const sql1 = 'select ... ?';
const params1 = [1];

console.time('parallel');
async.parallel([
  function(callback) {
     setTimeout(function() {
      callback(null, 1);
    }, 3000);
  },
  function(callback) {
    setTimeout(function() {
      callback(null, 2);
    }, 4000);
  },
  function(callback) {
    setTimeout(function() {
      callback(null, 4);
    }, 5000);
  },
], function(err, result) {
  if (err) {
    return console.log('err: ', err);
  }
  console.log('result: ', result);
  console.timeEnd('parallel');
});



console.time('series');
async.series({
  one: function(callback) {
     setTimeout(function() {
      callback(null, 1);
    }, 3000);
  },
  two: function(callback) {
    setTimeout(function() {
      callback(null, 2);
    }, 4000);
  },
  three: function(callback) {
    setTimeout(function() {
      callback(null, 4);
    }, 5000);
  }
}, function(err, result) {
  if (err) {
    return console.log('err: ', err);
  }
  console.log(result);
  console.timeEnd('series');
});