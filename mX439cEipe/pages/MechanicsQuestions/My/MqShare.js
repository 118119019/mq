var requests = require('../../../utils/requests.js');
var util = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mid = options.mid; 
    if(mid){
      var _this = this;
      var thrkey = requests.getThrkey();
      var parm = {
        action: "hasAnswerMq",
        three_key: thrkey,
        mid: mid
      };
      requests.request("bussiness/MQApi.ashx", parm, (res) => {
        switch (res.statecode) {
          case -1:
            requests.loginAndGetThreeKeyDo(
              function () {
                var key = wx.getStorageSync("three_key");
                console.log(key);
              }
            );
            break;
          case 0:
            wx.showModal({
              title: '错误提示',
              content: '加载异常',
              showCancel: false,
              success: function (__res) { }
            })
            break;
          case 1:
            var _data = res.data;
            console.log(_data);
            if(_data=="1"){
              wx.redirectTo({
                url: '../LookMQ?s=1&id=' + mid
              });
            }else{
              wx.redirectTo({
                url: '../AnswerMQ?mid=' + mid
              });
            }
            break;
          default:
            wx.showModal({
              title: '错误提示',
              content: '未知错误',
              showCancel: false,
              success: function (__res) { }
            })
            break;
        }
      }, () => {
      }, () => {
      });
    }else{
      wx.switchTab({
        url: '../../my/info',
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {   
     
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})