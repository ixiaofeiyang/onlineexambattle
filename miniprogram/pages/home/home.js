// miniprogram/pages/home/home.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    images: [
      'http://file.xiaomutong.com.cn/img101220.jpeg',
      'http://file.xiaomutong.com.cn/img101221.jpeg',
      'http://file.xiaomutong.com.cn/img101222.jpeg'
    ],
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData);
    this.onGetOpenid();
    this.onGetTime();
    this.onQuery();
  },
  onQuery: function(){
    const db = wx.cloud.database()
    db.collection('admin').doc('7498b5fe5f58602801397db064732f71')
    .get()
    .then(res=>{
      console.log('[数据库] [查询记录] 成功: ', res);
      let items = res.data.items;
      let idx = items.indexOf(app.globalData.openid);
      this.setData({
        items,
        idx
      },()=>{
        console.log(res.data.items);
        console.log(app.globalData.openid);
        console.log();
      })
    })
    .catch(err=>{
      console.error('[数据库] [查询记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
    })
  },
  onGetOpenid: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        let openid = res.result.openid;
        app.globalData.openid = openid;
        this.setData({
          openid
        })
       
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
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
    this.onGetOpenid();
    this.setData({
      role: app.globalData.userInfo.role,
      openid: app.globalData.openid,
      today: app.globalData.today
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
    return {
      title: "朋友邀请你来答题了",
      path: "pages/index/index",
      imageUrl: "http://file.xiaomutong.com.cn/img2020080601.png"
    };
  },
  goHistory: function(){
    let url = '/pages/history/history';
    wx.navigateTo({
      url: url
    })
  },

  zuheGo: function(){
    let url = '/pages/zuhehome/zuhehome';
    wx.navigateTo({
      url: url
    })
  },

  biaozhGo: function(){
    let url = '/pages/biaozhunselect/biaozhunselect';
    wx.navigateTo({
      url: url
    })
  },
  itemGo: function(){
    let url = '/pages/items/items';
    wx.navigateTo({
      url: url
    })
  },

  someviewGo: function(){
    let url = '/pages/someview/someview';
    wx.navigateTo({
      url: url
    })
  },
  assoGo: function(){
    let url = '/pages/asso/asso';
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
  bindgorank: function(){
    let url = '/pages/rank/rank';
    wx.navigateTo({
      url: url
    })
  },
  goSequence: function(){
    let url = '/pages/sequence/sequence';
    wx.navigateTo({
      url: url
    })
  },
  goRandom: function(){
    let url = '/pages/random/random';
    wx.navigateTo({
      url: url
    })
  },
  goTwo: function(){
    let url = '/pages/two/two';
    wx.navigateTo({
      url: url
    })
  },
  goThree: function(){
    let url = '/pages/examhome/examhome';
    wx.navigateTo({
      url: url
    })
  },
  bindgoabout: function(){
    let url = '/pages/about/index';
    wx.navigateTo({
      url: url
    })
  },
  goExam: function(){

    wx.showLoading({
      title: '加载中',
    })

    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'getExam',
      data: {

      }
    })
    .then(res => {
      wx.hideLoading()
      console.log('[云函数] [getExam]: ', res)
      let time = res.result.time;
      let num = Date.parse(new Date(time.replace(/-/g, '/')));
      
      let time1 = res.result.time1;
      let num1 = Date.parse(new Date(time1.replace(/-/g, '/')));

      let time2 = res.result.time2;
      let num2 = Date.parse(new Date(time2.replace(/-/g, '/')));

      if(num < num1){
        wx.showModal({
          showCancel: false,
          title: '提示',
          confirmText: '我知道了',
          content: '考试还未开始，请耐心等待',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })   
      }else if(num > num1 && num < num2){
        this.toExam();
      }else if(num > num2){
        wx.showModal({
          showCancel: false,
          title: '提示',
          confirmText: '我知道了',
          content: '考试已结束，谢谢参与',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })   
      }

      
    }).catch(err => {
      console.error('[云函数] [getExam] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })

  },
  toExam: async function(){

    const db = wx.cloud.database()
    const res = await db.collection('historys').where({
      _openid: this.data.openid,
      today: this.data.today
    }).count();
    if(res.total >= 1){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '每天只有1次答题机会',
        confirmText: '我知道了',
        success (res) {
          wx.hideLoading()
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }

    let url = '/pages/examhome/examhome?id=001';
    wx.navigateTo({
      url: url
    })

  },
  aboutGo: function(){
    let url = '/pages/about/about';
    wx.navigateTo({
      url: url
    })
  },
  goSix: function(){
    let url = '/pages/six/six';
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

  lianxiGo: function (e) {
    let url = '/pages/lianxihome/lianxihome?id=001';
    wx.navigateTo({
      url: url,
    })
  },
  findGo: function (e) {
    wx.navigateTo({
      url: '/pages/find/find?id=003',
    })
  },
  courseGo: function(){
    wx.navigateTo({
      url: '/pages/course/course',
    })
  },
  examGo: async function (e) {
    

    wx.navigateTo({
      url: '/pages/examhome/examhome?id=001',
    })

  },
  rankGo: function(){
    console.log('003');
    let url = '../rank/rank';
    wx.navigateTo({
      url: url
    })
  },
  noteGo: async function (e) {
    

    wx.navigateTo({
      url: '/pages/note/note?id=003',
    })

  },
  articleGo: function (e) {
    wx.navigateTo({
      url: "/pages/article/article",
    })
  }, 
  exportGo: function(){
    let url = '/pages/export/export';
    wx.navigateTo({
      url: url
    })
  },
  fileGo: function(){
    let url = '/pages/file/file';
    wx.navigateTo({
      url: url
    })
  },
  pdfGo: function(){
    let url = '/pages/pdffile/pdffile';
    wx.navigateTo({
      url: url
    })
  },
  attendGo: function(){
    let url = '/pages/list/list';
    wx.navigateTo({
      url: url
    })
  },
  historyGo: async function (e) {
    wx.navigateTo({
      url: "/pages/history/history",
    })
  },
  somecodeGo: function(){
    wx.navigateTo({
      url: "/pages/somecode/somecode",
    })
  },
  rolesGo: function(){
    wx.navigateTo({
      url: "/pages/roles/roles",
    })
  },
  rankGo: function (e) {
    wx.navigateTo({
      url: '/pages/rank/rank',
    })
  },
  aboutGo: function (e) {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  onGetTime: function() {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'getTime',
      data: {

      }
    })
    .then(res => {
      console.log('[云函数] [getTime]: ', res)
      
      
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  }
})