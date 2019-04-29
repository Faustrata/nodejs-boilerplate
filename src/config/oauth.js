const fetch = require('node-fetch');
const logger = require('../common/logger');
const { UEF_MS_LOGIN_URL } = require('../common/constant');

module.exports = async (req, res, next) => {
  const { authorization } = { ...req.headers };
  try {
    const ssoUser = `${UEF_MS_LOGIN_URL}/user`;
    const response = await fetch(ssoUser, { headers: { authorization } });
    if (response.status !== 200) {
      logger.error(`Oauth - ${response.statusText}`);
      res.status(response.status).json({
        errors: [
          {
            message: response.statusText,
          },
        ],
        data: {},
      });
      return;
    }
    next();
  } catch (error) {
    logger.error(`Oauth - ${error.message}`);
    throw new Error(error.message);
  }
};
