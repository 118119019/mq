var util = require('../../utils/util.js');
var requests = require('../../utils/requests.js');
function showTool(_this,str) {
  _this.setData({
    showTopTips: true,
    tips: str,
  });
  setTimeout(function () {
    _this.setData({
      showTopTips: false,
      tips: ""
    });
  }, 3000);
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    edit: false,
    sp: [],
    tips:"",
    showTopTips: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _edit = options.edit;
    if(_edit==1){
      this.setData({
        edit: true,
        sp: wx.getStorageSync("sp")
      });   
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
  
  },
 
  formSubmit: function (e) {
    var tkey = wx.getStorageSync("three_key");
    var that = this;
    var _sp = e.detail.value;    
    var isVaild=true;
    if (_sp.Place==""){
      isVaild=false;
      showTool(this,"服务地点未填写");
      return;
    }
    if (_sp.Name == "") {
      isVaild = false;
      showTool(this, "服务名未填写");
      return;
    }
    if (_sp.SContent == "") {
      isVaild = false;
      showTool(this, "设备名/服务内容未填写");
      return;
    }
    if (_sp.Cost == "") {
      isVaild = false;
      showTool(this, "费用说明未填写");
      return;
    }
    if (_sp.Contacts == "") {
      isVaild = false;
      showTool(this, "联系人未填写");
      return;
    }
    if (_sp.WeixinAccount == "") {
      isVaild = false;
      showTool(this, "微信号未填写");
      return;
    }
    if (isVaild){
      wx.request({
        url: "https://www.openmech.cn/api/bussiness/SPApi.ashx?action=spedit&three_key=" + tkey,
        data: _sp,
        header: {
          'Content-Type': 'application/json'
        },
        success: function (r) {
          var res = r.data;
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
              util.alert("保存失败，重新提交")
              break;
            case 1:
              wx.setStorageSync("sp", res.data);
              util.alert("保存成功",
                function () {
                  wx.switchTab({
                    url: '../my/info',
                  });
                }
              );
              break;
          }
        }
      })
    }
     
  },  
})