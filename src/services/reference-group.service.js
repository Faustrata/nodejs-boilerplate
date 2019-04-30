const { GraphQLClient } = require('graphql-request');
const logger = require('../common/logger');
const { getAsync } = require('../config/redis');
const { MASTER_DATA_URL } = require('../common/constant');

const fetchFromApi = (referenceGroup, authorization) => {
  const endpoint = `${MASTER_DATA_URL}/graphql`;
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      Authorization: authorization,
    },
  });

  const query = `
    {
      availableReferenceAccessByGroup(referenceGroup: "${referenceGroup}") {
            id
            code
            name
            referenceGroup
            isAlternateEntry
        }
    }
  `;
  return graphQLClient.request(query);
};

module.exports.availableReferenceAccessByGroup = async (root, args, context) => {
  const group = args.referenceGroup;
  const { authorization } = { ...context.headers };

  try {
    const data = await getAsync(group);
    if (data) {
      logger.info(`Fetch from Cache ${data}`);
      return JSON.parse(data);
    }

    const response = await fetchFromApi(group, authorization);
    logger.info(`Fetch from API ${JSON.stringify(response)}`);
    return response.availableReferenceAccessByGroup;
  } catch (error) {
    logger.error(error.message);
    throw new Error(error);
  }
};
