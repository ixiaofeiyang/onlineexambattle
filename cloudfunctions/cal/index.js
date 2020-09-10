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

    // 清空数据
    await db.collection('many').where({
      _id: _.exists(true)
    }).remove()

    let res = await db.collection('profiles')
    .aggregate()
    .project({
      _openid: 1,
      name: 1,
      tel: 1,
      branch: 1
    })
    .limit(1000)
    .end()

    console.log(res);

    let items = res.list;
    items.forEach(async (item, index) => {
      console.log(index);

      let _openid = item['_openid'];
      
      let name = item['name'];
      let tel = item['tel'];
      let branch = item['branch'];

      let res2 = await db.collection('daily')
      .aggregate()
      .match({
        _openid: _openid
      })
      .end()

      let items2 = res2.list;
      let score = 0;
      let minute = '00';
      let second = '00';
      items2.forEach(item=>{
        score = parseInt(score) + parseInt(item.score);

        minute = parseInt(minute) + parseInt(item.ytimes.split(":")[0]);
        second = parseInt(second) + parseInt(item.ytimes.split(":")[1]);
      });

      let delta = parseInt(second/60);
      console.log(minute,second,delta);
      second = second % 60;
      minute = parseInt(minute) + delta;
      console.log(minute,second,delta);
      
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;

      db.collection('many').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          name: name,
          tel: tel,
          ytimes: minute+':'+second,
          _openid: _openid,
          branch: branch,
          score: score,
          today: today,
          time: time
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