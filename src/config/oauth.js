const fetch = require('node-fetch');
const logger = require('../common/logger');

module.exports = (req, res, next) => {
  const { authorization } = { ...req.headers };

  try {
    const ssoUser = 'https://eform-unified-dev.apps.dev.corp.btpn.co.id/sso/user';
    logger.info(`Oauth - ${ssoUser} - ${authorization}`);
    fetch(ssoUser, { headers: { authorization } });
    next();
  } catch (error) {
    logger.error(`Oauth - ${error.message}`);
    res.status(401).json({
      code: 401,
      message: error.message,
    });
  }
};
