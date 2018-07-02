
var requests = require('utils/requests.js');
App({
    onLaunch: function () {
      console.log('这是 onLaunch')
      var tKey = wx.getStorageSync("three_key");
      if (!tKey) {
        requests.loginAndGetThreeKeyDo(
        );
      }else{        
        requests.updateThreeKeyDo(
        );
      }    
    },
    onShow: function () {
        console.log('这是 Show')
    },
    onHide: function () {
        //console.log('这是 Hide')
    },
    globalData: {
        hasLogin: false
    }
});