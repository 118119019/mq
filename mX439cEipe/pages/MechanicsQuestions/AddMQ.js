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
   * 页面的初始数据
   */
  data: {     
    MQ: null,
    Imgs: [], 
    MQContentList: [{
      id: 'A',
      content: ''
    }, {
      id: 'B',
      content: ''
    }],
    Answer: "A"
  },
  bindKeyInput: function (event) {
    var that = this;
    var value = event.detail.value
    var _index = event.currentTarget.dataset.id.replace('Contents','')
    var mqs = this.data.MQContentList;
    mqs[_index].content=value;
    this.setData({
      MQContentList: mqs
    })
  },
  addContentsIten: function () {
    var mqs = this.data.MQContentList;
    var count = mqs.length;
    if (count < 5) {
      count++;
      var desc = 'A';
      switch (count) {
        case 1:
          desc = 'A';
          break;
        case 2:
          desc = 'B';
          break;
        case 3:
          desc = 'C';
          break;
        case 4:
          desc = 'D';
          break;
        case 5:
          desc = 'E';
          break;
      }
      var item = {
        id: desc,
        content:'',//content: '设置选项' + count
      }
      mqs.push(item);
      this.setData({
        MQContentList: mqs
      })
    }     
  },
  delContentsIten: function () {
    var mqs = this.data.MQContentList;
    mqs.splice(mqs.length - 1, 1);
    this.setData({
      MQContentList: mqs,
      Answer: mqs[mqs.length - 1].id
    })
  },
  radioChange: function (e) {
    this.setData({
      Answer: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      Domain: requests.domain
    });
    var id = options.id;     
    if (id) {
      var parm = {
        action: "get",
        id: id
      };     
      requests.request("bussiness/MQApi.ashx", parm, (r) => {
        var item = r.data;
        var Imgs = [];
        if (item.ImgPath!=""){
          var Imgs = JSON.parse(item.ImgPath);
        }       
        this.setData({
          MQ: item,
          Imgs: Imgs,
          MQContentList: JSON.parse(item.MQContents),
          Answer: item.Answer          
        });
      }, () => {
      }, () => {
      });
    }
  },
  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        if (res.tempFiles[0].size > 4194304) {
          showTool(_this, "上传的图片超过4M，太大了！");
        } else {
          var tempFilePath = res.tempFilePaths[0];
          //启动上传等待中...  
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 10000
          })
          wx.uploadFile({
            url: requests.api_base + 'bussiness/MQApi.ashx',
            filePath: tempFilePath,
            name: 'uploadfile_ant',
            formData: {
              'imgIndex': 0,
              'action': 'uploadimg'
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (_res) {
              var _data = JSON.parse(_res.data);
              var imgList = _this.data.Imgs;
              imgList.push(_data.Url);
              _this.setData({
                Imgs: imgList
              })
              wx.hideToast();
            },
            fail: function (_res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (__res) { }
              })
            }
          });
        }
      }
    })
  },
  /**   
    * 预览图片  
    */
  previewImage: function (e) {
    var imgList = this.data.Imgs;
    var Domain = this.data.Domain;
    var imgs=[];
    for (var i = 0; i < imgList.length; i++) {
      var src =Domain+imgList[i];
      imgs.push(src);
    }
    wx.previewImage({
      current: imgs[e.target.dataset.imgindex],
      urls: imgs // 需要预览的图片http链接列表  
    })
  },
  delImageTap: function (e) {
    var imgIndex = e.target.dataset.imgindex;
    var imgList = this.data.Imgs;
    var imgs = [];
    imgList.splice(imgIndex, 1);
    this.setData({
      Imgs: imgList
    })
  }
  , gomy: function () {
    wx.switchTab({
      url: 'TabAnswer',
    })
  },
  formSubmit: function (e) {
    console.log('提交题目')
    var tkey = wx.getStorageSync("three_key");
    var that = this;
    var _mq = e.detail.value;
    var isVaild = true;
    if (_mq.MqDesc == "") {
      isVaild = false;
      showTool(this, "描述未填写");
      return;
    }
    var _contents = this.data.MQContentList;
    for (var i = 0; i < _contents.length; i++) {
      var item = _contents[i];
      switch (i) {
        case 0:
          item.content = _mq.ContentsA;
          break;
        case 1:
          item.content = _mq.ContentsB;
          break;
        case 2:
          item.content = _mq.ContentsC;
          break;
        case 3:
          item.content = _mq.ContentsD;
          break;
        case 4:
          item.content = _mq.ContentsE;
          break;
      }
      if (item.content == "") {
        isVaild = false;
        showTool(this, item.id + "选项内容未填写");
        break;
      }
    }
    if (!isVaild) {
      return;
    }
    _mq.ImgPath = JSON.stringify(this.data.Imgs);
    _mq.MQContents = JSON.stringify(_contents);
    if (_mq.Mid == "") {
      _mq.Mid = "00000000-0000-0000-0000-000000000000";
    }else{
      //判断是否修改
      var oldMq= this.data.MQ;
      if (oldMq.ImgPath == _mq.ImgPath &&
        oldMq.MQContents == _mq.MQContents &&
        oldMq.MqDesc == _mq.MqDesc  &&
        oldMq.Answer == _mq.Answer
      ){
        showTool(this,  "题目相关内容未做修改！");
        return;
      }
    }     
    if (isVaild) {
      wx.request({
        url: "https://www.openmech.cn/api/bussiness/MQApi.ashx?action=add&three_key=" + tkey,
        data: _mq,
        header: {
          'Content-Type': 'application/json'
        },
        success: function (r) {
          switch (r.data.statecode) {
            case -1:
              wx.showModal({
                title: '错误提示',
                content: '发布失败，重新提交' + '待重新登录',
                showCancel: false,
                success: function (__res) {
                  requests.loginAndGetThreeKeyDo(
                  );
                }
              })
              break;
            case 0:
              wx.showModal({
                title: '错误提示',
                content: '发布失败，重新提交',
                showCancel: false,
                success: function (__res) { }
              })
              break;
            case 1:
              wx.showModal({
                title: '发布成功',
                content: '发布成功',
                showCancel: false,
                success: function (__res) {
                  wx.switchTab({
                    url: '../my/info',
                  })
                }
              })
              break;
            case 2:
              wx.showModal({
                title: '发布失败',
                content: r.data.data,
                showCancel: false,
                success: function (__res) {
                  
                }
              })
              break;
            default:
              wx.showModal({
                title: '错误提示',
                content: '未知错误',
                showCancel: false,
                success: function (__res) { }
              })
              break;
          }

        }
      })
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
  }
})