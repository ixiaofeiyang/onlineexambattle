// 云函数入口文件
const cloud = require('wx-server-sdk')
const dateUtils = require('date-utils')

process.env.TZ ='Asia/Shanghai'
cloud.init({ env: process.env.Env })

//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async(event, context) => {
  try {

    let dt = new Date();
    let time = dt.addHours(8);
    let formatedtime = time.toFormat("YYYYMMDDHH24MI");

    let filename = 'file' + formatedtime + '.xlsx';

    // let {userdata} = event

    let res = await cloud.database().collection('historys').orderBy('createTime', 'desc').limit(10).get();
    let userdata = res.data;
    userdata.reverse();
    //1,定义excel表格名
    let dataCVS = filename;
    //2，定义存储数据的
    let alldata = [];
    let row = ['_openid', '姓名','分数','时间']; //表属性
    alldata.push(row);
    //_openid,userInfo.nickName,nums,createTime
    for (let key in userdata) {

      let name = userdata[key].name || '';


      let arr = [];
      arr.push(userdata[key]._openid);
      arr.push(name);
      arr.push(userdata[key].score);
      arr.push(userdata[key].time1);
      alldata.push(arr)
    }
    //3，把数据保存到excel里
    var buffer = await xlsx.build([{
      name: "mySheetName",
      data: alldata
    }]);
    //4，把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })

  } catch (e) {
    console.error(e)
    return e
  }
}