const express = require('express');
const logger = require('../common/logger');
const { fetchFromApi } = require('../services/reference-group.service');
const redisClient = require('../config/redis');

const router = express.Router();

router.get('/reference/:group', async (req, res) => {
  const { group } = { ...req.params };
  const { authorization } = { ...req.headers };

  return redisClient.get(group, async (err, data) => {
    if (data) {
      logger.info(data);
      return res.json({ source: 'cache', data: JSON.parse(data) });
    }

    try {
      const response = await fetchFromApi(group, authorization);
      logger.info(response);
      return res.json({ source: 'api', data: response });
    } catch (error) {
      logger.error(error.message);
      const { status } = error.response;
      return res.status(status).json({
        code: status,
        message: JSON.stringify(error.response),
      });
    }
  });
});

module.exports = router;
