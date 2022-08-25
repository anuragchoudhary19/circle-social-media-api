const redis = require('redis');
let redisClient;
(async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      redisClient = redis.createClient({ url: process.env.REDIS_URL });
    } else {
      redisClient = redis.createClient();
    }
    await redisClient.connect();
  } catch (error) {
    console.log(error);
  }
})();

exports.analytics = async (ip) => {
  try {
    let newData = { ip: ip, timestamp: new Date() };
    await redisClient.rPush('ips:twitter', JSON.stringify(newData));
  } catch (error) {
    console.log(error);
  }
};
