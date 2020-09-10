// 云函数入口文件
const cloud = require('wx-server-sdk')
const uuidV1 = require('uuid/v1');


cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  
  let uuid = uuidV1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a' 

  return {
    uuid: uuid
  }
}