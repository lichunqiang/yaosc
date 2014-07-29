var config = require('./config');
var osc = require('../')(config);


var auth_url = osc.getAuthUrl('xxyaa');

console.log(auth_url);

//get code
// osc.getAccessToken('xxx', function(err, data){
// 	console.log(data);
// 	// data = JSON.parse(data);
// 	console.log(data.error)
// });

//error handler

osc.on('error', function(err){
	console.log(err);
});


// osc.getUserInfo(function(err, data){
// 	console.log(err)
// });