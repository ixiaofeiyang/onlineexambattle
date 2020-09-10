// miniprogram/pages/attendance/attendance.js
const util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uuid: '',
    attend: false,
    num: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    this.setData({
      id: options.id || 'b5416b755f58ddfa01730eef16b5de04'
    },()=>{
      this.onQuery();
    })

    const db = wx.cloud.database();
    const res = await db.collection('attendances').where({
      activity: 'b5416b755f58ddfa01730eef16b5de04'
    }).count();

    if(res.total > 0){
      this.setData({
        attend: true
      })
    }

  },
  onQuery: function(){
    const db = wx.cloud.database()
    db.collection('activity').doc(this.data.id)
    .get()
    .then(res=>{
      console.log('[数据库] [查询记录] 成功: ', res);
      let data = res.data
      this.setData({
        activity: data,
        num: data.num
      },()=>{
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
    this.onGetUUID();
  },
  onGetTime: function(){
    let time = util.formatTime(new Date());
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getTime',
      // 传给云函数的参数
      data: {
      },
    })
    .then(res => {
      console.log('[云函数] [getTime]: ', res)
      this.setData({
        time: res.result.time
      })
    })
    .catch((err)=>{
      console.error('[云函数] [getTime] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
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
  
  doAttendance: function(){
    let that = this;

    const db = wx.cloud.database()
    db.collection('attendances').add({
      data: {
          _id: that.data.uuid,
          activity: this.data.activity._id,
          name: this.data.activity.name,
          userInfo: app.globalData.userInfo,
          time: that.data.time
        }
      })
      .then(res=>{
        wx.showToast({
          icon: 'success',
          title: '打卡成功'
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
        // 在返回结果中会包含新创建的记录的 _id
        that.updateInfo();
        that.setData({
          attend: true,
          num: that.data.num++
        })
      })
      .catch(err=>{
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      })
  },
  updateInfo: function(){
    let that = this;

    const db = wx.cloud.database()

    const _ = db.command
    db.collection('activity').doc(this.data.activity._id).update({
      data: {
        // 表示指示数据库将字段自增 10
        num: _.inc(1)
      },
      success: function(res) {
        console.log(res)
      }
    })
  },
  generate: function(){
    return util.formatTime(new Date());
  },
  viewAttendance: function(){
    let id = this.data.id
    let url = '/pages/attendance/attendance?id='+id;
    wx.navigateTo({
      url: url
    })
  },
  attendGo: function(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let url = '/pages/attendance/attendance?id='+id;
    wx.navigateTo({
      url: url
    })
  },
  onGetUUID: function() {
    // 调用云函数
    let that = this;
    wx.cloud.callFunction({
      name: 'getUUID',
      data: {

      }
    })
    .then(res => {
      console.log('[云函数] [getUUID]: ', res)
      this.setData({
        uuid: res.result.uuid
      },()=>{
        console.log(this.data.uuid);
      })
      
    }).catch(err => {
      console.error('[云函数] [getUUID] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  }
})