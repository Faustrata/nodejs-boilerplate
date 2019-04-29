const redis = require('redis');
const { promisify } = require('util');
const logger = require('../common/logger');

const redisClient = redis.createClient(6379);
redisClient.on('connect', () => {
  logger.info('Completed to connect Redis Cache');
});

redisClient.on('error', (error) => {
  logger.error(error);
});

const getAsync = promisify(redisClient.get).bind(redisClient);

module.exports = getAsync;
