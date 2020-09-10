// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  try {
    let res1 = await db.collection('questions')
    .aggregate()
    .match({
      typecode: '01'
    })
    .sample({
      size: 5
    })
    .end()

    let res2 = await db.collection('questions')
    .aggregate()
    .match({
      typecode: '02'
    })
    .sample({
      size: 3
    })
    .end()

    let res3 = await db.collection('questions')
    .aggregate()
    .match({
      typecode: '04'
    })
    .sample({
      size: 2
    })
    .end()


    console.log(res1,res2,res3);
    let arr1 = res1.list;
    let arr2 = res2.list;
    let arr3 = res3.list;
    let items = arr1.concat(arr2,arr3);

    return {
      list: items
    }

  } catch(e) {
    console.error(e)
  }
}