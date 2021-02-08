const queryString = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { access } = require('./src/utils/log');

const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  console.log('tiem', d.toGMTString())
  return d.toGMTString()
}

// session 数据
const SESSION_DATA = {};

// 用于处理 post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if(req.method !== 'POST') {
      resolve({})
      return 
    }
    if(req.headers['content-type'] !=='application/json') {
      resolve({})
      return
    }
    let postData = '';
    req.on('data', chunk => {
      postData = postData + chunk.toString();
    })
    req.on('end', ()=> {
      if(!postData) {
        resolve({})
        return
      } 
      resolve(JSON.parse(postData))
    })
  })
  return promise
}

const serverHandle = (req, res) => {
  // 记录 access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

  res.setHeader('Content-type', 'application/json');
  const url = req.url;
  req.path = url.split('?')[0];
  req.query = queryString.parse(url.split('?')[1]);

  // 解析cookie
  req.cookie = {};
  const coolieStr = req.headers.cookie || '';
  coolieStr.split(';').forEach(item => {
    if(!item) {
      return
    }
    // 会自动多拼个空格 所以 trim 一下
    const arr = item.split('=');
    let key = arr[0].trim();
    let val = arr[1].trim();
    req.cookie[key] = val
  })
  

  // 解析 session
  let needSetCookie = false;
  let userId = req.cookie.userid;
  if(userId) {
    if(!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    } 
  } else {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`
    SESSION_DATA[userId] = {};
  }
  req.session = SESSION_DATA[userId];

  // 处理 postdata
  getPostData(req).then(postData => {
    req.body = postData;

    // 处理 blog get 请求
    const blogResult = handleBlogRouter(req,res);
    if(blogResult) {
      blogResult.then(blogData => {
        if(needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
          JSON.stringify(blogData)
        )
      })
      return
    }
    
    // const blogData = handleBlogRouter(req,res)
    // if(blogData) {
    //   res.end(
    //     JSON.stringify(blogData)
    //   )
    //   return
    // }

    // 处理 user post 请求
    const userResult = handleUserRouter(req,res);
    if(userResult) {
      userResult.then(userData => {
        if(needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
          JSON.stringify(userData)
        )
      })
      return
    }

    // const userData = handleUserRouter(req,res)
    // if(userData) {
    //   res.end(
    //     JSON.stringify(userData)
    //   )
    //   return
    // }

    // 未命中路由返回 404
    res.writeHead(404, {"Content-type": "text/plain"})
    res.write("404 not fount")
    res.end()
  })
  
}

module.exports = serverHandle