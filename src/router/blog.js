
const { getList, getDatail, newBlog, updateBlog, delBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

// 统一的登录验证
const loginCheck = (req) => {
  if(!req.session.username) {
    return Promise.resolve((
      new ErrorModel('尚未登录')
    ))
  }
}

const handleBlogRouter = (req, res) => {
  const method = req.method;
  const id = req.query.id;

  // 获取博客列表
  if(method === 'GET' && req.path === '/api/blog/list') {
    let author = req.query.author || '';
    const keyword = req.query.keyword || '';
    // const listData = getList(author, keyword);

    // return new SuccessModel(listData)
    if(req.query.isadmin) {
      // 管理员界面
      const loginCheckResult = loginCheck(req);
      if(loginCheckResult) {
        // 未登录
        return loginCheckResult
      }
      // 强制查询自己的博客
      author = req.session.username;
    }
    const result = getList(author, keyword);
    return result.then(listData => {
      return new SuccessModel(listData)
    })
  }

  // 获取博客详情
  if(method === 'GET' && req.path === '/api/blog/detail') {
    // const data = getDatail(id);
    // return new SuccessModel(data);
    const result = getDatail(id);
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 新建
  if(method === 'POST' && req.path === '/api/blog/new') {
    // const blogData = req.body;
    // const data = newBlog(blogData)
    // return new SuccessModel(data) 

    const loginCheckResult = loginCheck(req);
    if(loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    const author = req.session.username;
    req.body.author = author;
    const result = newBlog(req.body)
    return result.then(data => {
      return new SuccessModel(data) 
    })
  }

  // 更新
  if(method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req);
    if(loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    const result = updateBlog(id, req.body);
    return result.then(val => {
      if(val) {
        return new SuccessModel()
      } else {
        return new ErrorModel('更新失败')
      }
    })
  }

  // 删除
  if(method === 'POST' && req.path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req);
    if(loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    const author = req.session.username;
    const result = delBlog(id, author);
    return result.then(val => {
      if(val) {
        return new SuccessModel();
      } else {
        return new ErrorModel()
      }
    })
  }
}

module.exports = handleBlogRouter;