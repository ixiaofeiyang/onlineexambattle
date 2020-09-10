// 云函数入口文件
const cloud = require('wx-server-sdk')
const dateUtils = require('date-utils')

process.env.TZ ='Asia/Shanghai'
cloud.init({ env: process.env.Env })

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {


  let dt = new Date();
  // let dt = new Date().addHours(8);
  let time = dt.toFormat("YYYY-MM-DD HH24:MI:SS");
  let today = dt.toFormat("YYYY-MM-DD");

  return {
    time,
    today
  }
}