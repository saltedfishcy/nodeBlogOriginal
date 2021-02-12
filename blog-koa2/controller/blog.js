const { exec } = require('../db/mysql');
const xss = require('xss');

const getList = async (author, keyword) => {
  // author 和 keyword 不一定存在  所以加个 where 1=1 保证拼接后语法不会错
  // 同理技巧  baidu.html?a=1&....  可以固定拼接a=1，这样后面字符串就可以不用管?  全都拼接 &xxx
  let sql = `select * from blogs where 1=1 `;
  if(author) {
    sql = sql + `and author='${author}' `
  }
  if(keyword) {
    sql = sql + `and title like '%${keyword}%' `
  }
  sql = sql + `order by createtime desc;`

  return await exec(sql)
}

const getDatail = async (id) => {
  const sql = `select * from blogs where id='${id}'`;
  return await exec(sql).then(rows => {
    return rows[0]
  })
}


const newBlog = async (blogData = {}) => {
  const title = xss(blogData.title);
  const content = xss(blogData.content);
  const author = xss(blogData.author);
  const createtime = Date.now();

  const sql = `
    insert into blogs (title, content, author, createtime)
    values ('${title}', '${content}', '${author}', ${createtime});
  `
  return await exec(sql).then(insertData => {
    // console.log('insertData', insertData)
    return {
      id: insertData.insertId
    }
  })
}

const updateBlog = async (id, blogData = {}) => {
  const title = blogData.title;
  const content = blogData.content;
  const sql = `
    update blogs set title='${title}', content='${content}' where id=${id}
  `
  return await exec(sql).then(updateData => {
    // console.log('updateData', updateData)
    // 影响了1行
    if(updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}


const delBlog = async (id, author) => {
  const sql = `delete from blogs where id='${id}' and author='${author}'`;

  return await exec(sql).then(delData => {
    if(delData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getList,
  getDatail,
  newBlog,
  updateBlog,
  delBlog
}