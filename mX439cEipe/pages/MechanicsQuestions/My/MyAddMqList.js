var util = require('../../../utils/util.js');
var requests = require('../../../utils/requests.js');
function requestData() {
  var _this = this; 
  var tkey = wx.getStorageSync("three_key");
  ajaxDo(_this, tkey, 0);
  ajaxDo(_this, tkey, -1);
  ajaxDo(_this, tkey, 1);
  ajaxDo(_this, tkey, -2);
  ajaxDo(_this, tkey, 2);
};
function ajaxDo(_this, tkey, mqState){
  var parm = {
    action: "mymqlist",
    indexpage: 1,
    three_key: tkey,
    mqState: mqState,
    pageCount:2
  };
  requests.request("bussiness/MQApi.ashx", parm, (result) => {
    var list = result.data;
    if (list.length == 0) {
    } else {
      var obj={};
      obj.list=list;
      switch (mqState) {        
        case -2:
           _this.setData({
            UnqualifiedMqs: obj
          });
          break;
        case -1:
          _this.setData({
            FailedMqs: obj
          });
          break;
        case 0:
          _this.setData({
            NormalMqs: obj
          });
          break;
        case 1:
          _this.setData({
            ApprovedMqs: obj
          });
          break;
        case 2:
          _this.setData({
            PublishedMqs: obj
          });
          break;
      }
    }
  }, () => {
    _this.setData({ totalRecord: 0 });
  }, () => {
    _this.setData({ loadingMore: false });
  });

}
Page({
  toLookMore:function(e){
    var mqstatu = e.currentTarget.dataset.mqstatu;
    wx.navigateTo({
      url: 'MyAddMqsMore?mqstatu=' + mqstatu
    });
  },
  toDetailPage: function(e) {
    var id = e.currentTarget.dataset.mid;
    var mqstatu = e.currentTarget.dataset.mqstatu;
    if (mqstatu =='-1'){
      wx.navigateTo({
        url: '../AddMQ?id=' + id 
      });
    }else{
       wx.navigateTo({
       url: '../LookMQ?id=' + id
      });
     }    
  },
  /**
   * 页面的初始数据
   */
  data: {
    UnqualifiedMqs:{},
    FailedMqs: {},
    NormalMqs: {},
    ApprovedMqs: {},
    PublishedMqs: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  onShareAppMessage: function (e) {
    var _mid = e.target.dataset.mid
    var _desc = e.target.dataset.desc
    return {
      title: '分享我出的题目',
      desc: _desc,
      path: 'pages/MechanicsQuestions/My/MqShare?mid=' + _mid
    }
  }
})