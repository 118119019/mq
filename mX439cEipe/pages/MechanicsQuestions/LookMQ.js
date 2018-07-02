var util = require('../../utils/util.js');
var requests = require('../../utils/requests.js');
Page({
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
  /**
   * 页面的初始数据
   */
  data: {
    isShare:false
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
    this.setData({
      Domain: requests.domain
    });
    var isShare = options.s;
    if (isShare){
      this.setData({
        isShare:true
      });
    }

    var id = options.id;
    if (id) {
      var parm = {
        action: "get",
        id: id
      };
      requests.request("bussiness/MQApi.ashx", parm, (r) => {
        var item = r.data;
        var _mq = item;
        _mq.MQContentList = JSON.parse(item.MQContents);
        _mq.Domain = requests.domain;
        _mq.Imgs = JSON.parse(item.ImgPath);
        _mq.curOp ="look";
         this.setData({
          MQ: _mq         
        });
      }, () => {
      }, () => {
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
  onShareAppMessage: function (e) {
    var _mid = e.target.dataset.mid
    var _desc = e.target.dataset.desc
    return {
      title: '分享题目',
      desc: _desc,
      path: 'pages/MechanicsQuestions/My/MqShare?mid=' + _mid
    }
  },
  gomy:function(){
    requests.goHome('../../');
  }
})