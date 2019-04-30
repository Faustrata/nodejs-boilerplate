const fetch = require('node-fetch');
const logger = require('../common/logger');
const redisGetData = require('../config/redis');
const { MASTER_DATA_URL } = require('../common/constant');

module.exports.fetchFromApi = (referenceGroup, authorization) => {
  const endpoint = `${MASTER_DATA_URL}/reference?group=${referenceGroup}`;
  return fetch(endpoint, {
    headers: {
      Authorization: authorization,
    },
  });
};


module.exports.availableReferenceAccessByGroup = async (root, args, context) => {
  const group = args.referenceGroup;
  const { authorization } = { ...context.headers };

  try {
    const data = await redisGetData(group);
    if (data) {
      logger.info(`Fetch from Cache ${data}`);
      return JSON.parse(data.availableReferenceAccessByGroup);
    }

    const response = await this.fetchFromApi(group, authorization);
    logger.info(`Fetch from API ${JSON.stringify(response.availableReferenceAccessByGroup)}`);
    return response.availableReferenceAccessByGroup;
  } catch (error) {
    logger.error(error.message);
    throw new Error(error);
  }
};
