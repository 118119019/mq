var requests = require('../../utils/requests.js');
var util = require('../../utils/util.js');
function showTool(_this, str) {
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
  /**
   * 页面的初始数据
   */
  data: {
    answerMqEnabl: true,
    MQ: { Mid: "", MqDesc: "", nickName:""},
    Imgs:[],
    ImgPath: "",
    ImgUrl: "",
    MyAnswer: ""
  },
  radioChange: function (e) {
    this.setData({
      MyAnswer: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    var thrkey = requests.getThrkey();
    if (!thrkey){
      wx.switchTab({
        url: '../my/info',
      }) 
      return;
    }
    var _mid = options.mid;
    if(_mid){
      var parm = {
        action: "get",
        id: _mid
      };
      requests.request("bussiness/MQApi.ashx", parm, (r) => {
        var item = r.data;
        var _mq = item;
        _mq.MQContentList = JSON.parse(item.MQContents);
        _mq.Domain = requests.domain;
        _mq.Imgs = JSON.parse(item.ImgPath);
        _mq.curOp = 'answer';
        this.setData({
          MQ: _mq,
          answerMqEnabl: false,
        });
      }, () => {
      }, () => {
      });
    }else{
      var parm = {
        action: "getNeedAnswerMq",
        three_key: thrkey
      };
      requests.request("bussiness/MQApi.ashx", parm, (r) => {
        var item = r.data;
        if (!item) {
          wx.showModal({
            title: '无题目提示',
            content: '暂时没有新题目可以回答！',
            showCancel: false,
            success: function (__res) {
              wx.switchTab({
                url: '../my/info',
              })
            }
          })
          return
        }
        var _mq = item;
        _mq.MQContentList = JSON.parse(item.MQContents);
        _mq.Domain = requests.domain;
        _mq.Imgs = JSON.parse(item.ImgPath);
        _mq.curOp = 'answer';
        this.setData({
          MQ: _mq,
          answerMqEnabl: false,
        });
      }, () => {
      }, () => {
      }, "POST");
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  onShareAppMessage: function (e) {
    var _mid = e.target.dataset.mid
    var _desc = e.target.dataset.desc
    return {
      title: '分享题目',
      desc: _desc,
      path: 'pages/MechanicsQuestions/My/MqShare?mid=' + _mid
    }
  },
  gomy: function () {
    wx.switchTab({
      url: 'TabAnswer',
    })
  },
  answerMq: function () {
    wx.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 1000
    });
    var MyAnswer = this.data.MyAnswer;
    var mq = this.data.MQ;
    if (MyAnswer == "") {
      showTool(this, "请选择选项！");
      return;
    }
    var desc = 'sorry，回答错误，继续加油！正确答案是' + mq.Answer;
    var answerRight = MyAnswer == mq.Answer;
    if (answerRight) {
      desc = '恭喜您回答正确！';
    }
    mq.AnswerCount = mq.AnswerCount + 1;    
    var that=this;
    this.setData({
      MQ: mq,
      answerMqEnabl: true,
      resultDesc: desc,
    })
    var tkey = wx.getStorageSync("three_key");
    var parm = {
      action: "addAnswerResult",
      three_key: tkey,
      item: MyAnswer,
      astate: answerRight,
      mid: mq.Mid
    };
    requests.request("bussiness/MQApi.ashx", parm, (res) => {
      if (res.statecode!=1)
      {
        switch (res.statecode) {
          case -1:
            break;
          case 0:
            wx.showModal({
              title: '错误提示',
              content: '提交答题结果失败，重新提交',
              showCancel: false,
              success: function (__res) { }
            })
            break;
          case 1:
            wx.showModal({
              title: '答题成功',
              content: '提交答题结果',
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
  answerNextMq:function(){
    wx.switchTab({
      url: 'TabAnswer',
    }) 
  }   
})