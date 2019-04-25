const express = require('express');

const logger = require('./src/common/logger');
const referenceGroupRoute = require('./src/routes/reference-group.route');
require('./src/config/redis');
const oauthClient = require('./src/config/oauth');

const app = express();

app.use(oauthClient);

app.use(referenceGroupRoute);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

app.listen(3000, () => {
  logger.info(`Server listening on port: ${3000}`);
});


module.exports = app;
