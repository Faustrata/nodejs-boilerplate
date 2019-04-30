const redis = require('redis');
const redisMock = require('redis-mock');
const { promisify } = require('util');
const logger = require('../common/logger');

const redisClient = process.env.NODE_ENV === 'test' ? redisMock.createClient() : redis.createClient(6379);
redisClient.on('connect', () => {
  logger.info('Completed to connect Redis Cache');
});

redisClient.on('error', (error) => {
  logger.error(error);
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

module.exports = {
  getAsync,
  setAsync,
};
