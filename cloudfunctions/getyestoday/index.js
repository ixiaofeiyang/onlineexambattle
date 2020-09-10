// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment');

process.env.TZ ='Asia/Shanghai'
cloud.init({ env: process.env.Env })

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  let month = moment().format('YYYYMM');
  let today = moment().format('YYYYMMDD');
  let yestoday = moment().subtract(1, 'days').format('YYYYMMDD');

  
  return {
    month,
    today,
    yestoday,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}