var requests = require('../../utils/requests.js');
var util = require('../../utils/util.js');
function get4kc(_this, thrkey){
  var parm = {
    action: "get4kc",
    three_key: thrkey
  };
  requests.request("bussiness/KCApid.ashx", parm, (r) => {
    var item = r.data;
    var _page = item;
    _this.setData({
      page: _page
    });
  }, () => {
  }, () => {
  });
} 
Page({
  /**   
    * 预览图片  
    */
  previewImage: function (e) {
    var imgList = this.data.page.CardUrls;
    var Domain = this.data.Domain;
    var imgs = [];
    for (var i = 0; i < imgList.length; i++) {
      var src = Domain + imgList[i];
      imgs.push(src);
    }
    wx.previewImage({
      current: imgs[e.target.dataset.imgindex],
      urls: imgs // 需要预览的图片http链接列表  
    })
  },
  nextCards:function(){
    var thrkey = requests.getThrkey();
    if (!thrkey) {
      wx.switchTab({
        url: '../my/info',
      })
      return;
    }
    get4kc(this, thrkey);
  },
  gotoHasReadCards:function(){

    wx.redirectTo({
      url: 'HasReadCards',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thrkey = requests.getThrkey();
    if (!thrkey) {
      wx.switchTab({
        url: '../my/info',
      })
      return;
    }
   var domain = requests.domain;
    var nickName = wx.getStorageSync("nickName");
    var avatarUrl = wx.getStorageSync("avatarUrl");
    this.setData({      
      nickName: nickName,
      avatarUrl: avatarUrl,
      Domain: domain
    });
    get4kc(this, thrkey);
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