const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = async(username, password) => {
  username = username;
  password = password;
  // 生成加密密码
  password = genPassword(password);
  const sql = `
    select username, realname from users where username='${username}' and password='${password}'
  `
  return await exec(sql).then(rows => {
    return rows[0] || {}
  })
}

module.exports = {
  login
};