// 云函数入口文件
const cloud = require('wx-server-sdk')

const dateUtils = require('date-utils')

process.env.TZ ='Asia/Shanghai'
cloud.init({ env: process.env.Env })

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  console.log(event);
  try {
    let dt = new Date();
    let today = dt.toFormat("YYYY-MM-DD");

    let res = await db.collection('daily')
    .where({
      _openid: wxContext.OPENID,
      today: today
    })
    .get()

    console.log(res);
    
    let items = res.data;
    let maxScore = 0;
    items.forEach(item=>{
      if(maxScore < item.score){
        maxScore = item.score;
      }
    })

    console.log(maxScore);

    return await db.collection('daily')
    .where({
      today: today,
      score: _.gt(maxScore)
    }).count()

  } catch(e) {
    console.error(e)
  }
}