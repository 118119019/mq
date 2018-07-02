var requests = require('../../utils/requests.js');
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag: true
  },
  showDisclaimer:function(){
    wx.navigateTo({
      url: 'Disclaimer'
    });
  },
  showMyAnswerMq: function () {
    wx.navigateTo({
      url: '../MechanicsQuestions/My/MyAnswerMqs'
    });
  },
  showSpList:function(){
    wx.navigateTo({
      url: '../ServiceProvider/list'
    });
  },
  showMyMq: function () {
    wx.navigateTo({
      url: '../MechanicsQuestions/My/MyAddMqList'
          });
   },
  showMySp: function () {
    var _this = this;
    var thrkey = requests.getThrkey();
    var parm = {
      action: "mysp",
      three_key: thrkey
    };
    requests.request("bussiness/SPApi.ashx", parm, (res) => {
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
          wx.navigateTo({
            url: 'mysp?hassp=0'
          });
          break;
        case 1:
          wx.setStorageSync("sp", res.data);
          wx.navigateTo({
            url: 'mysp?hassp=1'
          });
          break;
      }
    }, () => {
    }, () => {
    });
  },
  showAttent: function () {
    this.setData({ 
      flag: false 
       })
  },
  hideAttent: function () {
    this.setData({ flag: true })
  },
  showQrCode:function(e){
    var imgName = e.currentTarget.dataset.img;
    var _qcurl = 'http://www.openmech.cn/qrcode/' + imgName + '.jpg';
    wx.navigateTo({
      url: 'qrcode?qcurl='+_qcurl
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tKey = wx.getStorageSync("three_key");
    if (!tKey) {
      requests.loginAndGetThreeKeyDo(
      );
    } else {
      requests.updateThreeKeyDo(
      );
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