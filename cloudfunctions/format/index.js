// 云函数入口文件
const cloud = require('wx-server-sdk')
const dateUtils = require('date-utils')

process.env.TZ ='Asia/Shanghai'
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  try {
    let dt = new Date();
    let today = dt.toFormat("YYYY-MM-DD");
    let time = dt.toFormat("YYYY-MM-DD HH24:MI:SS");

    let res = await db.collection('daily')
    .aggregate()
    .match({
      today: today
    })
    .limit(1000)
    .end()

    let items = res.list;
    items.forEach((item)=>{
      let _id = item['_id'];
      let minute = parseInt(item.ytimes.split(":")[0]);
      let second = parseInt(item.ytimes.split(":")[1]);
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;
      console.log(_id,minute+':'+second)
      db.collection('daily').doc(_id).update({
        // data 字段表示需新增的 JSON 数据
        data: {
          ytimes: minute+':'+second,
        }
      })
      .then(res => {
        console.log(res)
      })
      .catch(err=>{
        console.log(err);
      })
    })

  
  } catch(e) {
    console.error(e)
  }
}