const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleUserRouter = (req,res) => {
  const method = req.method;
  // 登录
  if(method === 'POST' && req.path === '/api/user/login') {
    const { username, password } = req.body;
    const result = login(username, password);
    return result.then(data => {
      if(data.username) {
        // 设置session
        req.session.username = data.username;
        req.session.realname = data.realname;
        console.log('sess', req.session)
        return new SuccessModel()
      }else {
        return new ErrorModel()
      }
    })
  }
}

module.exports = handleUserRouter;