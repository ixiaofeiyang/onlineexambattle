// 云函数入口文件
const cloud = require('wx-server-sdk')

const dateUtils = require('date-utils')

process.env.TZ ='Asia/Shanghai'
cloud.init({ env: process.env.Env })

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  try {
    let dt = new Date();
    let today = dt.toFormat("YYYY-MM-DD");

    return await db.collection('many')
    .where({
      score: _.gt(0)
    })
    .orderBy('score', 'desc')
    .orderBy('ytimes', 'asc')
    .limit(100)
    .get()

  } catch(e) {
    console.error(e)
  }
}