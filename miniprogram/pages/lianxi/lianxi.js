// miniprogram/pages/exam/exam.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    showModal: false,
    score: 0,
    maxScore: 0,
    total: 0,
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(util.getTime(new Date()))
    console.log(app.globalData);
    let that = this;
    this.onGetTime();
    this.onGetOpenid();
    this.setData({
      id: options.id
    },()=>{
      this.onQueryQuestion();
    })
    
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
  onQueryQuestion: function(){
    let that = this;

    // 在小程序代码中：
    wx.cloud.callFunction({
      name: 'getQues',
      data: {
        id: this.data.id
      },
      complete: res => {
        console.log('callFunction getQues result: ', res);
        let items = res.result.list;
        let questions = [];
        items.map((item,idx)=>{
          // console.log(idx);
          // console.log(item);

          let options = item.options;
          options.forEach((o)=>{
            o.selected = false;
          })

          item.index = idx;
          item.selected = false;
          item.status = false;
          item.options = options;
          questions.push(item);
        })
        that.setData({
          question: questions[0],
          questions,
          num: questions.length
        },()=>{
          console.log('已赋值完成')
          console.log('正确答案')
          console.log(this.data.question['answer']);
          wx.hideLoading()
        })
      },
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

    let unitMap = app.globalData.unitMap;
    this.setData({
      unitMap
    })

  },
  selectGo: function(e){
    console.log(e.currentTarget.dataset);
    let selectedCode = e.currentTarget.dataset.code;
    let questions = this.data.questions;
    let question = this.data.question;
    if(question.selected){
      return;
    }
    let index = question.index;
    let typecode = question.typecode;
    let options = question.options;
    let answer = question.answer;

    switch(typecode){
      case '01':
          options.map((option)=>{
            option.selected = false;
            if(option.code == selectedCode){
              option.selected = true;
            }
          });
          break;
      case '02':
          options.map((option)=>{
            if(option.code == selectedCode){
              option.selected = !option.selected;
            }
          });
          break;
      case '03':
          options.map((option)=>{
            option.selected = false;
            if(option.code == selectedCode){
              option.selected = true;
            }
          });
          break; 
      case '04':

        break;  
      default: 
      console.log('其他未涉及题型')
    }

    question.options = options;
    questions[index] = question;
    this.setData({
      questions,
      question
    })
  },
  // bindKeyInput: function (e) {
  //   console.log(e.detail.value);
  // },
  bindKeyInput: function (e) {
    // console.log(e.detail.value);
    this.setData({
      inputValue: e.detail.value.trim()
    })
  },
  nextGo: function(){
    let currentIndex = this.data.currentIndex;

    let questions = this.data.questions;
    let question = this.data.question;
    let index = question.index;
    let options = question.options;
    let answer = question.answer;
    let typecode = question.typecode;
    let inputValue = this.data.inputValue;

    let selected = false;
    options.forEach(option => {
      if(option.selected){
        selected = true;
      }
    })
    switch(typecode){
      case '01':
      case '02':
      case '03':
          if(!selected ){
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '请先选择您的答案',
              confirmText: '我知道了',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            return;
          }
          break; 

      case '04':
          if(inputValue == '' ){
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '请先填写答案',
              confirmText: '我知道了',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            return;
          }
        break;  
      default: 
      console.log('其他未涉及题型')
    }


    question.selected = true;

    let selectedCodeArr = [];
    options.forEach(option => {
      if(option.selected){
        selectedCodeArr.push(option.code)
      }
    })

    switch(typecode){
      case '01':
      case '02':
      case '03':
          console.log(answer);
          console.log(selectedCodeArr.sort().join(''));
          if(answer == selectedCodeArr.sort().join('')){
            question.status = true;
          }
          break; 

      case '04':
          if(answer == inputValue){
            question.status = true;
          }
        break;  
      default: 
      console.log('其他未涉及题型')
    }


    console.log(question)

    questions[index] = question;

    this.setData({
      questions,
      question
    },()=>{
      
        if(this.data.currentIndex == this.data.num-1){
          wx.showToast({
            title: '最后一题',
            mask: true,
            icon: 'success',
            duration: 2000
          })
          
        }else{
          setTimeout(()=>{
            this.doNext();
          },1000)
        }
      
    })


  },
  doNext: function(){
    let currentIndex = this.data.currentIndex;
    let questions = this.data.questions;
    currentIndex++;
    this.setData({
      inputValue: '',
      currentIndex,
      question: questions[currentIndex]
    },()=>{
      console.log('正确答案')
      console.log(this.data.question['answer']);
    })
  },
  addHistory: function(){
    let that = this;
    let questions = this.data.questions;

    let unitMap = this.data.unitMap;

    let score = 0;
    questions.forEach(ques => {
      if(ques.status){
        score += unitMap[ques.typecode];
      }
    })

    let {name, tel, branch} = app.globalData.userInfo;

    let time = this.data.time;
    let time2 = util.getTime(new Date());

    let time1 = this.data.time;

    console.log(time1);
    console.log(time2);
    let difftime = (new Date(time2) - new Date(time1))/1000; //计算时间差,并把毫秒转换成秒
    difftime = Math.abs(difftime);
    
    let minutes = parseInt(difftime%3600/60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
   	let seconds = parseInt(difftime%60);  // 以60秒为一整份 取余 剩下秒数
     
    let ytimes = minutes+':'+seconds;

    const db = wx.cloud.database()
    db.collection('historys').add({
      data: {
        questions: this.data.questions,
        score,
        name,
        tel,
        branch,
        today: this.data.today,
        time1,
        time2,
        ytimes: this.data.ytimes
      }
    })
    .then(res=>{
      console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      if(this.data.total > 0 && this.data.maxScore < score){
        this.updateDaily(time1, time2, score);
      }
      if(this.data.total == 0){
        this.addDaily(time1,time2,score);
      }
      this.setData({
        showModal: true,
        score
      },()=>{
        wx.hideToast();
      })
    })
    .catch(err=>{
      console.error('[数据库] [新增记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
    })

  },
  addDaily: function(time1,time2,score){
    let that = this;

    let {name, tel, branch} = app.globalData.userInfo;

    console.log(time1);
    console.log(time2);
    let date1 = new Date(time1.replace(/-/g, '/'));
    let date2 = new Date(time2.replace(/-/g, '/'));

    let difftime = ( Date.parse(date2)- Date.parse(date1) )/1000; //计算时间差,并把毫秒转换成秒
    difftime = Math.abs(difftime);

	  let minutes = parseInt(difftime%3600/60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
   	let seconds = parseInt(difftime%60);  // 以60秒为一整份 取余 剩下秒数
     
    let ytimes = minutes+':'+seconds;

    const db = wx.cloud.database()
    db.collection('daily').add({
      data: {
        questions: this.data.questions,
        score,
        name,
        tel,
        branch,
        today: this.data.today,
        time1,
        time2,
        ytimes: ytimes
      }
    })
    .then(res=>{
      console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
 
    })
    .catch(err=>{
      console.error('[数据库] [新增记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
    })

  },

  rankGo: function(){
    console.log('003');
    let url = '../rank/rank';
    wx.redirectTo({
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
      let openid = res.result.openid;
      that.setData({
        openid:openid
      },async ()=>{
        const db = wx.cloud.database();
        const res = await db.collection('daily').where({
          _openid: openid,
          today: app.globalData.today
        }).count();
        that.setData({
          total: res.total
        })
        console.log(res);
        if(res.total > 0){
          that.queryDaily(openid);
        }
      });
      
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },
  queryDaily: function(openid){
    let that = this;
    const db = wx.cloud.database()
    db.collection('daily')
    .where({
      _openid: openid,
      today: app.globalData.today
    })
    .get()
    .then((res)=>{
      console.log('[数据库] [查询记录] 成功: ', res);

      let items = res.data;
      let maxScore = 0;
      let _id = '';
      items.forEach(item=>{
        if(item.score > maxScore){
          maxScore = item.score;
          _id = item._id;
        }
      })
      
      this.setData({
        _id,
        maxScore
      })
    })
    .catch((err)=>{
      console.log(err)
      console.error('[数据库] [查询记录] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
    })
  },
  updateDaily: function(time1, time2, score){
    console.log(time1);
    console.log(time2);
    let date1 = new Date(time1.replace(/-/g, '/'));
    let date2 = new Date(time2.replace(/-/g, '/'));

    let difftime = ( Date.parse(date2)- Date.parse(date1) )/1000; //计算时间差,并把毫秒转换成秒
    difftime = Math.abs(difftime);
    
	  let minutes = parseInt(difftime%3600/60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
   	let seconds = parseInt(difftime%60);  // 以60秒为一整份 取余 剩下秒数
     
    let ytimes = minutes+':'+seconds;
    const db = wx.cloud.database();
    db.collection('daily').doc(this.data._id).update({
      // data 传入需要局部更新的数据
      data: {
        time1,
        time2,
        score,
        ytimes: ytimes
      }
    })
    .then(res=>{
      console.log('[数据库] [更新记录] 成功: ', res);
    })
    .catch(err=>{
      console.log(err);
      wx.showToast({
        title: '更新异常',
        icon: 'success',
        duration: 2000
      })
    })

  },
})