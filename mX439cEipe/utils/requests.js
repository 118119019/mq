var utils = require('../utils/util.js');
const API_BASE = "https://www.openmech.cn/api/";
const DOMAIN_BASE = "https://www.openmech.cn/";
/**
 * 网路请求
 */
function request(api, data, successCb, errorCb, completeCb, method) {
  if (!method){
    method = 'GET';
  }
  wx.request({
    url: API_BASE+api,
    method: method,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      if (res.statusCode == 200) {
        utils.isFunction(successCb) && successCb(res.data);
      } else
        console.log('请求异常', res);
    },
    error: function () {
      utils.isFunction(errorCb) && errorCb();
    },
    complete: function () {
      utils.isFunction(completeCb) && completeCb();
    }
  });
}
function loginAndGetThreeKeyDo(action){
  var threeKey="";
  wx.login({
    success: function (res) {
      if (res.code) {
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        };
        wx.getUserInfo({
          success: function (resUSER) {            
            var userInfo = resUSER.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            var province = userInfo.province
            var city = userInfo.city
            var country = userInfo.country
            var rawData = resUSER.rawData;
            var signature = resUSER.signature;
            var encryptedData = resUSER.encryptedData;
            var iv = resUSER.iv;
            var parm = {
              "action": "onlogin",
              "code": code,
              "rawData": rawData,
              "signature": signature,
              'iv': iv,
              'encryptedData': encryptedData
            };
            request("wx/wx.ashx", parm, (r) => {
              if (r.errcode == 0) {
                wx.setStorageSync("three_key", r.three_key);
                wx.setStorageSync("nickName", userInfo.nickName);
                wx.setStorageSync("avatarUrl", userInfo.avatarUrl);               
              } else {
                console.log("获取第三方key失败" + r.data.errmsg);
              }               
            }, () => {
            }, () => {
            });                      
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });   
}
function updateThreeKeyDo(action) { 
  wx.login({
    success: function (res) {
      if (res.code) {
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        };
        wx.getUserInfo({
          success: function (resUser) {
            var _nickName = wx.getStorageSync("nickName");
            var _avatarUrl = wx.getStorageSync("avatarUrl");
            var userInfo=resUser.userInfo;
            var thrkey = wx.getStorageSync("three_key");
            var rawData = resUser.rawData;         
            var parm = {
              "action": "updateThreeKey",
              "op":"0",             
              "rawData": rawData, 
              three_key: thrkey            
             };
            if (userInfo.nickName != _nickName ||
              userInfo.avatarUrl != _avatarUrl
            ) {
              parm.op="1";  
            } 
            request("wx/wx.ashx", parm, (r) => {
              if (r.errcode == 0) {               
                wx.setStorageSync("nickName", userInfo.nickName);
                wx.setStorageSync("avatarUrl", userInfo.avatarUrl);                 
              } 
              if (r.statecode == -1) {
                loginAndGetThreeKeyDo();
              } 
            }, () => {
            }, () => {
            }); 
          }
        })
      } else {
        console.log('更新用户登录态失败！' + res.errMsg)
      }
    }
  });
}
function getThrkey() {
  var thrkey = wx.getStorageSync("three_key");
  if (!thrkey) {
    loginAndGetThreeKeyDo(
      function () {
        thrkey = wx.getStorageSync("three_key");        
      }
    );
  }
  return thrkey;
}
/**
 * 返回首页
 */
function goHome(path){
  wx.switchTab({
    url: path+'pages/my/info',
  })
}
module.exports = {   
  domain: DOMAIN_BASE,
  api_base:API_BASE,
  request: request,
  loginAndGetThreeKeyDo: loginAndGetThreeKeyDo,
  updateThreeKeyDo: updateThreeKeyDo,
  getThrkey: getThrkey,
  goHome: goHome
}
