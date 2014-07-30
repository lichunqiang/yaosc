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
/***********************个人信息相关接口*************************/

//获取当前登录用户信息
Oschina.prototype.getUserInfo = function(callback) {
  if(!this.accessToken) {
    return this.emit('error', new Error('Please get access token first!'));
  }
  request.post(OPENAPI_URL_PREFIX + 'user', {access_token: this.accessToken}, function(error, response, body){
    return callback(error, body);
  });
};

//获取用户详情
Oschina.prototype.getUserDetailInfo = function(data) {
  if(!this.accessToken) {
    return this.emit('error', new Error('Please get access token first!'));
  }
  data.access_token = this.accessToken;
  data.dataType = 'json';
  request.post(OPENAPI_URL_PREFIX + 'user_information', data, function(error, response, body){
    return callback(error, body);
  });
};

//获取当前登录用户信息详情
Oschina.prototype.getMyDetailInfo = function() {
  if(!this.accessToken) {
    return this.emit(error, new Error('Please get access token first!'));
  }
  var data = {};
  data.access_token = this.accessToken;
  data.dataType = 'json';
  request.post(OPENAPI_URL_PREFIX + 'my_information', data, function(error, response, body) {
    return callback(error, body);
  });
};

//更新用户头像
Oschina.prototype.updatePortrait = function(data) {
  if(!this.accessToken) {
    return this.emit(error, new Error('Please get access token first!'));
  }
  data.access_token = this.accessToken;
  request.post(OPENAPI_URL_PREFIX + 'portrait_update', data, function(error, response, body) {
    return callback(error, body);
  });
};

//获取好友列表
Oschina.prototype.getFriendList = function(data) {
  if(!this.accessToken) {
    return this.emit(error, new Error('Please get access token first!'));
  }
  data.access_token = this.accessToken;
  data.dataType = 'json';
  request.post(OPENAPI_URL_PREFIX + 'friends_list', data, function(error, response, body) {
    return callback(error, body);
  });
};

//获取动态列表
Oschina.prototype.getActiveList = function(data) {
  if(!this.accessToken) {
    return this.emit(error, new Error('Please get access token first!'));
  }
};

//
//Error Handler

// Oschina.prototype.addListener('error', function(){

// });