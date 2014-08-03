//deps
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var request = require('request').defaults({json: true});
//const
var OSC_AUTH_URL_PREFIX = 'http://www.oschina.net';
var OPENAPI_URL_PREFIX = OSC_AUTH_URL_PREFIX + '/action/openapi/';

var interfaceList = require('./interfaces');

module.exports = Oschina;
inherits(Oschina, EventEmitter);

function Oschina(config) {
  if(!(this instanceof Oschina)) return new Oschina(config);
  this.config = config;
}

Oschina.prototype.setAccessToken = function(accessToken) {
  this.accessToken = accessToken;
};

//获取授权地址
Oschina.prototype.getAuthUrl = function(state){
	state = state || '';
	return OSC_AUTH_URL_PREFIX + '/action/oauth2/authorize?client_id=' + this.config.client_id
					+ '&response_type=code&redirect_uri=' + this.config.redirect_uri + '&state=' + state;
};

//根据code获取access_token
Oschina.prototype.getAccessToken = function(code, callback) {
	var data = {};
  data.client_id = this.config.client_id;
  data.client_secret = this.config.client_secret;
  data.grant_type = "authorization_code";
  data.redirect_uri = this.config.redirect_uri;
  data.code = code;
  request.post(OPENAPI_URL_PREFIX + "token", data, function (error, response, body) {
    return callback(error, body);
  });
};

//请求接口
Oschina.prototype.request = function(_interface, data, callback) {
  // if(!this.accessToken) {
  //   return this.emit('error', new Error('Please get access token first!'));
  // }
  if(typeof data  === 'function') {
    callback = data;
    data = {};
  }
  if(typeof callback !== 'function') {
    return this.emit('error', new Error('Callback must be a function!'));
  }
  data.access_token = data.access_token || this.accessToken;
  data.dataType = 'json';
  console.log('Request url %s', OPENAPI_URL_PREFIX + _interface);
  request.post(OPENAPI_URL_PREFIX + _interface, data, function(error, response, body){
    return callback(error, body);
  });
};

//extend
interfaceList.forEach(function(_interface, key){
  Oschina.prototype[_interface] = function(data, callback) {
    this.request(_interface, data, callback);
  };
});

//Error Handler

// Oschina.prototype.addListener('error', function(){

// });