const fs = require('fs');
const path = require('path');

const fileName = path.resolve(__dirname, 'data.txt');

// 读取文件
// fs.readFile(fileName, (err, data)=> {
//   if(err) {
//     console.log(err)
//     return
//   }
//   // data是二进制类型，需要转换成字符串
//   console.log(data.toString())
// })

// 写入文件
const content = '这是写入'
const opt = {
  flag: 'a',  // 追加写入 ‘a' 重写 'w'
}
fs.writeFile(fileName, content, opt, (err)=> {
  if(err) {
    console.log(err)
  }
})

// 判断文件是否存在
fs.exists(fileName, (exists)=> {
  console.log('exists', exists)
})
