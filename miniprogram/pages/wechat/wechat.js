// miniprogram/pages/wechat/wechat.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onGetOpenid();
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
  onGotUserInfo: async function(e) {
    let that = this;
    console.log(e);
    if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        //拒绝
        wx.showModal({
          showCancel: false,
          title: '提示',
          confirmText: '我知道了',
          content: '确定使用游客身份体验吗',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.goHome();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })        

    } else if (e.detail.errMsg === 'getUserInfo:ok') {
        //允许
        
        let openid = this.data.openid;
        let userInfo = e.detail.userInfo;
        app.globalData.userInfo = userInfo;


        const db = wx.cloud.database();
        const res = await db.collection('profiles').where({
          _openid: openid
        }).count();

        console.log(res);

        db.collection('profiles').doc(this.data.openid).update({
          // data 字段表示需新增的 JSON 数据
          data: {
            userInfo: userInfo
          }
        })
        .then(res => {
          console.log(res)
          console.log('[数据库] [查询记录] 成功: ', res);
          that.goMe();
        })
        .catch((err)=>{
          console.log(err)
          that.goMe();
        })
          


    }

  },
  goHome: function(){
    wx.switchTab({
      url: '../home/home',
    })
  },
  goMe: function(){
    wx.switchTab({
      url: '../me/me',
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
  }
})