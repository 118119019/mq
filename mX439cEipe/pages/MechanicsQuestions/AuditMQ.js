var util = require('../../utils/util.js');
var requests = require('../../utils/requests.js');
Page({
  /**   
   * 预览图片  
   */
  previewImage: function (e) {
    var imgList = this.data.MQ.Imgs;
    var Domain = this.data.MQ.Domain;
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
  auditRadioChange: function (e) {
    this.setData({
      MqState: e.detail.value
    })
  },
  gomy: function () {
    wx.switchTab({
      url: 'TabAnswer',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {    
    opMqEnabl:true,
    MQ: {}, 
    MqState:0   
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
    var parm = {
      action: "getToAuditList",
      three_key: thrkey
    };
    requests.request("bussiness/MQApi.ashx", parm, (r) => {
      var item = r.data;
      if (!item) {
        wx.showModal({
          title: '无题目审核提示',
          content: '暂时没有新题目可以审核！',
          showCancel: false,
          success: function (__res) {
            wx.switchTab({
              url: '../my/info',
            })
          }
        })
        return
      }
      var _mq=item;
      _mq.MQContentList = JSON.parse(item.MQContents);
      _mq.Domain = requests.domain;
      _mq.Imgs = JSON.parse(item.ImgPath);  
      _mq.curOp = 'audit';
      this.setData({
        opMqEnabl: false, 
        MQ: _mq         
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
  },
  auditMq: function () {
    wx.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 1000
    });
    var myMqState = this.data.MqState;  
    var mq = this.data.MQ;
    if (myMqState==0) {
      util.showTool(this, "请选择同意或不同意发布！");
      return;
    }    
    var tkey = wx.getStorageSync("three_key");
    var parm = {
      action: "auditMq",
      three_key: tkey,
      MQStatu: myMqState,    
      mid: mq.Mid
    };
    this.setData({
      opMqEnabl: true,       
    })
    requests.request("bussiness/MQApi.ashx", parm, (res) => {
      if (res.statecode != 1) {
        switch (res.statecode) {
          case -1:
            break;
          case 0:
            wx.showModal({
              title: '错误提示',
              content: '提交审题失败，重新提交',
              showCancel: false,
              success: function (__res) { }
            })
            break;
          case 1:
            wx.showModal({
              title: '审题成功',
              content: '提交审题结果',
              showCancel: false,
              success: function (__res) {
                /* wx.switchTab({
                   url: 'TabAnswer',
                 }) */
              }
            })
            break;
        }
      }
    }, () => {
    }, () => {
    });
  },
  opNextMq:function() {
    wx.switchTab({
      url: 'TabAudit',
    })
  }   
})