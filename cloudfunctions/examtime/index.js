// 云函数入口文件
const cloud = require('wx-server-sdk')
const dateUtils = require('date-utils')

process.env.TZ ='Asia/Shanghai'
cloud.init({ env: process.env.Env })

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  let res = await db.collection('time')
  .doc('001')
  .get()

  let dt = new Date();
  let now = dt.toFormat("YYYY-MM-DD HH24:MI:SS");
  // let time1 = "2020-05-03 15:00:00";
  // let time2 = "2020-05-03 15:30:00";

  let time1 = res.data.time1;
  let time2 = res.data.time2;
  let date1 = new Date(time1).addHours(8);
  let date2 = new Date(time2).addHours(8);
  return {
    now: now,
    date1: date1,
    date2: date2,
    // open: true
    open: dt.between(date1, date2)
  }
}