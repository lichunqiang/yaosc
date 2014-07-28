//deps
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var request = require('request').defaults({json: true});
//const
var OSC_AUTH_URL_PREFIX = 'http://www.oschina.net';
var OPENAPI_URL_PREFIX = OSC_AUTH_URL_PREFIX + '/action/openapi/'

module.exports = Oschina;
inherits(Oschina, EventEmitter);

function Oschina(config) {
  if(!(this instanceof Oschina)) return new Oschina(config); 
  this.config = config;
}

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