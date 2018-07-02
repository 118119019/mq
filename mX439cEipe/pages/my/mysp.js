var requests = require('../../utils/requests.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hassp: true,
    sp:null,
    wxaccount:"",
    showTopTips:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.hassp==0){
      this.setData({
        hassp: false
      });

    }else{
      this.setData({
        hassp: true,
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
  inputTyping: function (e) {
    this.setData({
      wxaccount: e.detail.value    
    });   
  },
  bindSp:function(){
    var _this = this;
    var thrkey = wx.getStorageSync("three_key");
    var wxaccount = _this.data.wxaccount;
    if (wxaccount==""){
      _this.setData({
        showTopTips: true  
      });
      setTimeout(function () {
        _this.setData({
          showTopTips: false
        });
      }, 3000);
      return;
    }
    if (!thrkey) {
      requests.loginAndGetThreeKeyDo(
        function () {
          var key = wx.getStorageSync("three_key");
          console.log("刷新");
        }
      );
    } else {
      var parm = {
        action: "bindSp",
        three_key: thrkey,
        wxaccount: wxaccount,
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
            util.alert("没有找到对应服务商信息")
            break;
          case 1:
            util.alert("绑定成功")
            _this.setData({
              hassp: true,
              sp: res.data
            });
            break;
        }
      }, () => {
      }, () => {
      });
    }   
  },
  bindSpEdit:function(){
    wx.navigateTo({
      url: '../ServiceProvider/SPEdit?edit=1'
    });
  },
  addSp: function () {
    wx.navigateTo({
      url: '../ServiceProvider/SPEdit?edit=0'
    });
  }
})