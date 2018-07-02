var util = require('../../utils/util.js');
var requests = require('../../utils/requests.js');
function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i].CardId === obj.CardId) {
      return true;
    }
  }
  return false;
}
function requestData() {
  var _this = this;
  var start = _this.data.pageIndex;
  var key = _this.data.inputVal;
  var parm = {
    action: "getkclist",
    indexpage: start,
    key: key
  };
  requests.request("bussiness/KCApid.ashx", parm, (r) => {
    var list=r.data;
    if (list.length == 0) {
      //没有记录
      //_this.setData({ totalRecord: 0 });
    } else {
      var oldPageData = _this.data.pageData;
      var _list = [];
      for (var i = 0; i < list.length; i++) {
        if (!contains(oldPageData, list[i]))
        {
          _list.push(list[i]);
        }           
      }
      _this.setData({
        pageData: oldPageData.concat(_list),
        totalRecord: list.length,
        pageIndex: start + 1,
      });
    }
  }, () => {
    _this.setData({ totalRecord: 0 });
  }, () => {
    _this.setData({ loadingMore: false });
  });
};


// pages/index/index.js
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    scrollHeight: 0, //scroll-view高度
    pageIndex: 1, //页码
    totalRecord: 0, //图书总数
    isInit: true, //是否第一次进入应用
    loadingMore: false, //是否正在加载更多
    parm: null,
    pageData: [], //服务商数据

  },
  previewImage: function (e) {
     
    var imgs = [];
    imgs.push(e.target.dataset.src);
     
    wx.previewImage({
      current: imgs[0],
      urls: imgs // 需要预览的图片http链接列表  
    })
  },
  onLoad: function (options) {
    var domain = requests.domain; 
    this.setData({   
      Domain: domain
    });
    var parm = { action: "getkclist" };
    this.setData({ parm: parm, indexpage: 1 });
    requestData.call(this);
  },//页面显示获取设备屏幕高度，以适配scroll-view组件高度
  onShow: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight - (res.windowWidth / 150) //80为顶部搜索框区域高度 rpx转px 屏幕宽度/750
        });
      }
    })
  },
  //下拉请求数据
  scrollLowerEvent: function (e) {
    var start = this.data.pageIndex;
    console.log(start)
    if (this.data.loadingMore)
      return;
    var parm = { action: "getkclist", indexpage: start };
    this.setData({ parm: parm });
    requestData.call(this);
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
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
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  },
})