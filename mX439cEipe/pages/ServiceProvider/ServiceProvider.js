
var WxParse = require('../../components/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var requests = require('../../utils/requests.js');


Page({
  tapCopytoClipboard: function () {    
    wx.setClipboardData({
      data: this.data.sp.WeixinAccount ,
      success: function (res) {
         wx.showToast({
           title: '复制到剪贴板成功',icon:'succes',duration:1000,mask:true
         })
      }
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    loadidngHidden: false,
    sp: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var _this = this;
    var parm = {
      action: "spdetail",
      id: id
    };
    requests.request("bussiness/SPApi.ashx", parm, (data) => {
      _this.setData({
        sp: data
      });

    }, () => {

    }, () => {

    });
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