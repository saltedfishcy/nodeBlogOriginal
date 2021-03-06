const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

const redisClient = redis.createClient(REDIS_CONF.prot, REDIS_CONF.host);

redisClient.on('error', err => {
  console.log('err', err)
})

module.exports = redisClient