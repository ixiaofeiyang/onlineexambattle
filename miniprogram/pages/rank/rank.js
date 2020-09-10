// miniprogram/pages/rank/rank.js



Page({

  /**
   * 页面的初始数据
   */
  data: {
    daily: true,
    total: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    this.onQuery();
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
//   onQuery: function(){
//       let that = this;
//       const db = wx.cloud.database()
//       db.collection('daily')
//       .orderBy('score', 'desc')
//       .get()
//       .then(res=>{
//         console.log('[数据库] [查询记录] 成功: ', res);
//         let items = res.data;
//         this.setData({
//           historys: items
//         });
//       })
//       .catch(err=>{
//         console.error('[数据库] [查询记录] 失败：', err)
//         wx.showToast({
//           icon: 'none',
//           title: '查询记录失败'
//         })
//       })
//   },
//   onQuery2: function(){
//     let that = this;
//     const db = wx.cloud.database()
//     db.collection('many')
//     .orderBy('score', 'desc')
//     .get()
//     .then(res=>{
//       console.log('[数据库] [查询记录] 成功: ', res);
//       let items = res.data;
//       this.setData({
//         historys: items
//       });
//     })
//     .catch(err=>{
//       console.error('[数据库] [查询记录] 失败：', err)
//       wx.showToast({
//         icon: 'none',
//         title: '查询记录失败'
//       })
//     })
// },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getRankNum();
  },
  dailyGo: function(){
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      daily: true,
      total: false
    },()=>{
      this.onQuery();
      this.getRankNum();
    })
  },
  totalGo: function(){
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      daily: false,
      total: true
    },()=>{
      this.onQuery2();
      this.getManyNum();
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
  onQuery: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'fetchDaily',
      data: {}
    })
    .then(res=>{
      console.log('[云函数] [fetchDaily]: ', res)
      let items = res.result.data;
      this.setData({
        historys: items
      },()=>{
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        
      });
    })
    .catch(err=>{
      console.error('[云函数] [fetchDaily] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  onQuery2: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'fetchMany',
      data: {}
    })
    .then(res=>{
      console.log('[云函数] [fetchMany]: ', res)
      let items = res.result.data;
      // let arr = items.concat(items,items,items,items,items,items,items);
      this.setData({
        historys: items
      },()=>{
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        
      });
    })
    .catch(err=>{
      console.error('[云函数] [fetchMany] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  getRankNum: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getRankNum',
      data: {}
    })
    .then(res=>{
      console.log('[云函数] [getRankNum]: ', res)
      let total = res.result.total;
      // let arr = items.concat(items,items,items,items,items,items,items);
      this.setData({
        sortNo: total+1
      });
    })
    .catch(err=>{
      console.error('[云函数] [getRankNum] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  getManyNum: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getManyNum',
      data: {}
    })
    .then(res=>{
      console.log('[云函数] [getManyNum]: ', res)
      let total = res.result.total;
      // let arr = items.concat(items,items,items,items,items,items,items);
      this.setData({
        sortNo: total+1
      });
    })
    .catch(err=>{
      console.error('[云函数] [getManyNum] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  }
})