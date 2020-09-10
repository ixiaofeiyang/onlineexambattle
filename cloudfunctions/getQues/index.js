// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  try {
    let res = await db.collection('questions')
    .aggregate()
    .sample({
      size: 10
    })
    .end()

    return {
      list: res.list
    }

  } catch(e) {
    console.error(e)
  }
}