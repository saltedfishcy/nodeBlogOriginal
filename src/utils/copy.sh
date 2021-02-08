#!/bin/sh
cd /study/file/node/Node.js+Express+Koa2+MySQL开发博客项目/nodeBlogOriginal/logs   // windows 中这样写应该有问题
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log