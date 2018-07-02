var util = require('../../../utils/util.js');
var requests = require('../../../utils/requests.js');
function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i].Mid === obj.Mid) {
      return true;
    }
  }
  return false;
};
function requestData() {
  var _this = this;
  _this.setData({ loadingMore: true });   
  ajaxDo(_this);
};
function ajaxDo(_this) {
  var tkey = wx.getStorageSync("three_key");
  var start = _this.data.pageIndex;
  var key = _this.data.inputVal;
  var parm = {
    action: "myAnswerMqs",
    indexpage: start,
    three_key: tkey,
    pageCount: 10,
    key: key
  };
  
  requests.request("bussiness/MQApi.ashx", parm, (result) => {
    _this.setData({ loadingMore: false });
    var list = result.data;
    if (list.length == 0) {
    } else {
      var oldPageData = _this.data.pageData;
      var _list = [];
      for (var i = 0; i < list.length; i++) {
        if (!contains(oldPageData, list[i]))
          _list.push(list[i]);
      }
      if (list.length == 10) {
        _this.setData({
          pageIndex: start + 1,
        });
      } else {
        _this.setData({
          pageIndex: 1,
        });
      }
      var pageData = oldPageData.concat(_list);
      _this.setData({
        pageData: pageData,
        totalRecord: pageData.length,
      });
    }
  }, () => {
    _this.setData({ totalRecord: 0 });
    _this.setData({ loadingMore: false });
  }, () => {
    _this.setData({ loadingMore: false });
  });
}
Page({
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
      inputShowed: true
    });
    console.log(e.detail.value);
  },
  //搜索按钮点击事件
  searchClickEvent: function (e) {
    if (!this.data.inputVal) {
      return;
    }
    
    this.setData({ pageIndex: 1, pageData: [] });
    requestData.call(this);
    this.setData({
      inputShowed: false
    });
  },
  toDetailPage: function (e) {
    var id = e.currentTarget.dataset.mid;
    wx.navigateTo({
      url: '../LookMQ?id=' + id
    });
  },
  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    scrollHeight: 0, //scroll-view高度
    pageIndex: 1, //页码
    totalRecord: 0, //总数
    isInit: true, //是否第一次进入应用
    loadingMore: false, //是否正在加载更多
    parm: null,
    pageData: [], //
  },
  scrollLowerEvent: function (e) {
    var start = this.data.pageIndex;
    console.log(start)
    if (this.data.loadingMore)
      return;
    requestData.call(this);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ indexpage: 1 });
    requestData.call(this);
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
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight - (res.windowWidth / 80) //80为顶部搜索框区域高度 rpx转px 屏幕宽度/750
        });
      }
    })
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var _mid = e.target.dataset.mid
    var _desc = e.target.dataset.desc
    return {
      title: '分享我答过的题目',
      desc: _desc,
      path: 'pages/MechanicsQuestions/My/MqShare?mid=' + _mid
    }
  }

})