const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = (username, password) => {
  console.log('username~~', username)
  username = username;
  password = password;
  // 生成加密密码
  password = genPassword(password);
  console.log('password', password)
  const sql = `
    select username, realname from users where username='${username}' and password='${password}'
  `
  return exec(sql).then(rows => {
    console.log('rows', rows)
    return rows[0] || {}
  })
}

module.exports = {
  login
};