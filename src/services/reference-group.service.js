const { GraphQLClient } = require('graphql-request');

module.exports = {
  fetchFromApi: async (referenceGroup, authorization) => {
    const endpoint = 'https://ms-master-data-eform-unified-dev.apps.dev.corp.btpn.co.id/graphql';
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
  },
};
