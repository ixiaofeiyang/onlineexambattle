// pages/home/index.js
const app = getApp()
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
    images: ['http://file.xiaomutong.com.cn/20200228/img01.jpeg','http://file.xiaomutong.com.cn/20200228/img02.jpeg','http://file.xiaomutong.com.cn/20200228/img03.jpeg'],
    openid:'',
    items: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      mode: options.mode,
      type: options.type,
    },()=>{
      this.onQuery();
    })
    
  },
  onQuery: function(){
    // 在小程序代码中：
    wx.cloud.callFunction({
      name: 'fetchActivity',
      data: {

      }
    })
    .then(res=>{
      console.log('callFunction fetchBranches result: ', res);
      let items = res.result.data;
      
      this.setData({
        items
      },()=>{
        wx.hideLoading()
      })
    })
    .catch(err=>{
      wx.hideLoading()
      console.error('[云函数] [getTime] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  // onQuery: function() {
  //   const db = wx.cloud.database()
  //   db.collection('exams')
  //   .orderBy('_id', 'asc')
  //   .get()
  //   .then(res=>{
  //     console.log(res);
  //     this.setData({
  //       items: res.data
  //     },()=>{
  //       wx.hideLoading()
  //     })
  //   })
  //   .catch(err=>{
  //     console.log(err);
  //     wx.hideLoading()
  //   })
       
  // },
  openFile: function(e){
    
    console.log(e.currentTarget.dataset.id);
    let file = e.currentTarget.dataset.file;
    wx.downloadFile({
      url: file,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },
  examGo: function(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let mode = this.data.mode;
    let url = '';
    switch(mode){
      case '1':
        url = '/pages/exam/exam?id='+id;
        wx.navigateTo({
          url: url
        })
        break;
      case '2':
        url = '/pages/moni/moni?id='+id;
        wx.navigateTo({
          url: url
        })
    }

  },
  toRankPage: function(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
  
    let url = '../rank/rank?id='+id;
    wx.navigateTo({
      url: url
    })
  }, 

  
  toEntryPage: function(e){
    console.log(e.currentTarget.dataset.code);
    let code = e.currentTarget.dataset.code;
    let url = '/pages/entry/index?code='+code;
    wx.navigateTo({
      url: url
    })
  },  
  toAttendPage: function(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    let url;
    url = '/pages/question/index?id='+id +'&title=' +title;
    wx.navigateTo({
      url: url
    })

  },
  attendGo: function(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let url = '/pages/activity/activity?id='+id;
    wx.navigateTo({
      url: url
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 1];
    console.log('开始输出');
    console.log(pages);
    console.log(prevPage);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onQuery();
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