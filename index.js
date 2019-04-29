const express = require('express');

const logger = require('./src/common/logger');
require('./src/config/redis');
const oauthClient = require('./src/config/oauth');
const graphql = require('./src/config/graphql');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Application is running' });
});

app.post('/graphql', oauthClient, graphql);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;


const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server listening on port: ${port}`);
});


module.exports = app;
