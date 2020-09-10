const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    openid: '',
    nickName: '',
    avatarUrl: '/images/header.png',
    grade: '',
    name: '',
    userInfo: {
      nickName: ' 请先授权',
      avatarUrl: '/images/header.png',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })

    console.log(app.globalData.userInfo);
    let openid = app.globalData.openid;
    this.queryProfile(openid);
    this.onGetUUID();
  },
  
  bindMyHuodong: function(){
    let url = '/pages/activity/index';
    wx.navigateTo({
      url: url
    })
  },
  bindMyHistory: function(){
    let url = '/pages/history/index';
    wx.navigateTo({
      url: url
    })
  },  
  bindMyStudy: function(){
    let url = '/pages/study/index';
    wx.navigateTo({
      url: url
    })
  },    
  bindgoname: function(){
    let url = '/pages/name/index';
    wx.navigateTo({
      url: url
    })
  },
  bindmyinfo: function(){
    let url = '/pages/notice/index';
    wx.navigateTo({
      url: url
    })
  },
  bindgopay: function(){
    let url = '/pages/pay/index';
    wx.navigateTo({
      url: url
    })
  },
  bindgosend: function(){
    let url = '/pages/send/index';
    wx.navigateTo({
      url: url
    })
  },
  bindgoabout: function(){
    let url = '/pages/about/about';
    wx.navigateTo({
      url: url
    })
  },
  infoGo: function(){
    let url = '/pages/meinfo/meinfo';
    wx.navigateTo({
      url: url
    })
  }, 
  bindgomode: function(){
    let url = '/pages/mode/index';
    wx.navigateTo({
      url: url
    })
  },   
  goTpl: function(){
    let url = '/pages/template/template';
    wx.navigateTo({
      url: url
    })
  },
  goExam: function(){
    let url = '/pages/list/list';
    wx.navigateTo({
      url: url
    })
  },
  pointsGo: function(){
    let url = '/pages/points/points';
    wx.navigateTo({
      url: url
    })
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
    let openid = app.globalData.openid;
    this.queryProfile(openid);
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
    return {
      title: "Prep Less; Gain More",
      path: "pages/index/index?openid="+app.globalData.openid+'&uuid='+this.data.uuid,
      imageUrl: "http://file.xiaomutong.com.cn/img2020080601.png"
    };
  },
  tapWechat: function(){
    wx.navigateTo({
      url: '../wechat/wechat',
    })
  },
  goHistory: function(){
    let url = '/pages/history/history';
    wx.navigateTo({
      url: url
    })
  },
  goHelp: function(){
    let url = '/pages/help/help';
    wx.navigateTo({
      url: url
    })
  },
  queryProfile: function(openid){
    const db = wx.cloud.database()
    db.collection('profiles').doc(openid)
    .get({
      success: res => {
        this.setData({
          grade: res.data.grade || '',
          name: res.data.name || '',
          userInfo: res.data.userInfo
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  onGetOpenid: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login]: ', res)
        let openid = res.result.openid
        that.queryProfile(openid);
        that.setData({
          openid: res.result.openid
        })
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  onGetUUID: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getUUID',
      data: {},
      success: res => {
        console.log('[云函数] [getUUID]: ', res)
        that.setData({
          uuid: res.result.uuid
        },()=>{
          wx.hideLoading()
        })
      },
      fail: err => {
        console.error('[云函数] [getUUID] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  }
})