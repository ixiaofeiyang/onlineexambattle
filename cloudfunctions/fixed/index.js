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

    let res = await db.collection('profiles')
    .limit(100)
    .field({
      _openid: true
    })
    .limit(1000)
    .get()

    console.log(res);

    let items = res.data;
    items.forEach(async (item, index) => {
      console.log(index);

      let _openid = item['_openid'];
      console.log(_openid);

      let res2 = await db.collection('daily')
      .where({
        _openid: _openid,
        today: '2020-06-26'
      })
      .count()
      if(res2.total>1){
        console.log(_openid);
        console.log(res2);
      }


      

    })

  

  } catch(e) {
    console.error(e)
  }
}