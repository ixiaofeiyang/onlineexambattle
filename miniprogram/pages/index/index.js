// miniprogram/pages/home/home.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })

    console.log(app.globalData)
    let that = this;

    wx.getSystemInfo({
      success (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })

      }
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
    this.onGetTime();
    this.onGetOpenid();
    this.onQueryQuesType();
  },
  onQueryQuesType: function(){
    let that = this;

    const db = wx.cloud.database()
    db.collection('questype')
    .get()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.data;
      let unitMap = {

      };
      items.forEach(item => {
        unitMap[item._id] = parseInt(item.unit);
      });
      console.log(unitMap);
      app.globalData.unitMap = unitMap;
    })
    .catch(err=>{
      console.error('[数据库] [查询记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      
    })
  },
  helpGo: function(){
    console.log('001');
    let url = '../help/help';
    wx.navigateTo({
      url: url
    })
  },
  examGo: async function(){
    console.log('002');
    wx.showLoading({
      mask: true,
      title: '跳转中',
    })
    this.toExam();

    // wx.cloud.callFunction({
    //   name: 'examtime',
    //   data: {
     
    //   }
    // })
    // .then(res => {
    //   console.log('[云函数] [examtime]: ', res)
    //   if(res.result.open){
       
    //   }else{
    //     wx.hideLoading()
    //     wx.showModal({
    //       title: '提示',
    //       showCancel: false,
    //       content: '考试时间已过期',
    //       confirmText: '我知道了',
    //       success (res) {
    //         if (res.confirm) {
    //           console.log('用户点击确定')
    //         } else if (res.cancel) {
    //           console.log('用户点击取消')
    //         }
    //       }
    //     })
    //   }
    // })
    // .catch(err=>{
    //   console.log(err);
    //   wx.hideLoading()
    // })
  
    

  },
  toExam: async function(){
 
    let total = this.data.total;
    wx.hideLoading()
    switch(total){
      case 0:
        wx.navigateTo({
          url: '../login/login'
        })
        break;
      case 1:
        wx.switchTab({
          url: '../home/home'
        })
        break;
    }
  },
  rankGo: function(){
    console.log('003');
    let url = '../rank/rank';
    wx.navigateTo({
      url: url
    })
  },
  aboutGo: function(){
    console.log('003');
    let url = '../about/about';
    wx.navigateTo({
      url: url
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
  onGetTime: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getTime',
      data: {}
    })
    .then(res=>{
      console.log('[云函数] [getTime]: ', res)
      app.globalData.today = res.result.today;
      that.setData({
        time: res.result.time,
        today: res.result.today
      })
    })
    .catch(err=>{
      console.error('[云函数] [getTime] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  onGetOpenid: function() {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {

      }
    })
    .then(res => {

      console.log('[云函数] [login]: ', res)
      app.globalData.openid = res.result.openid;
      let openid = res.result.openid;
      that.setData({
        openid:openid
      },async ()=>{
        wx.hideLoading()
        const db = wx.cloud.database();
        const res = await db.collection('profiles').where({
          _openid: openid
        }).count();
        that.setData({
          total: res.total
        })
        console.log(res);
        if(res.total > 0){
          that.queryProfile(openid);
        }
      });
      
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  queryProfile: function(openid){
    let that = this;
    const db = wx.cloud.database()
    db.collection('profiles')
    .doc(openid)
    .get()
    .then((res)=>{
      console.log('[数据库] [查询记录] 成功: ', res);
      let {name, tel, role, rolename, branch} = res.data;

      app.globalData.userInfo = {
        name,
        tel,
        role,
        rolename,
        branch
      };
    })
    .catch((err)=>{
      console.log(err)
      console.error('[数据库] [查询记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
    })
  }
})