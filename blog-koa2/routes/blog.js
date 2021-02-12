const router = require('koa-router')()
const { getList, getDatail, newBlog, updateBlog, delBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
  let author = ctx.query.author || '';
  const keyword = ctx.query.keyword || '';

    if(ctx.query.isadmin) {
     // 管理员界面
      if(ctx.session.username == null) {
        // 未登录
        ctx.body = new ErrorModel('未登录')
        return
      }
    //   // 强制查询自己的博客
      author = ctx.session.username;
    }
    const listData = await getList(author, keyword);
    ctx.body = new SuccessModel(listData);
})

router.get('/detail', async function (ctx, next) {
  const data = await getDatail(ctx.query.id);
  ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function (ctx, next) {
  ctx.request.body.author = ctx.session.username;
  const data = await newBlog(ctx.request.body);
  ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async function (ctx, next) {
  const val = await updateBlog(ctx.query.id, ctx.request.body);
  if(val) {
    ctx.body = new SuccessModel();
  } else {
    ctx.body = new ErrorModel('更新失败')
  }
})

router.post('/del', loginCheck, async function (ctx, next) {
  const author = ctx.session.username;
  const val = await delBlog(ctx.query.id, author);
  if(val) {
    ctx.body = new SuccessModel();
  } else {
    ctx.body = new ErrorModel('删除失败')
  }
})

module.exports = router
