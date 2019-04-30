const { stub, spy } = require('sinon');
const mock = require('nock');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const oauth = require('../../src/config/oauth');
const { UEF_MS_LOGIN_URL } = require('../../src/common/constant');
const logger = require('../../src/common/logger');

const { expect } = chai;
stub(logger, 'error');
chai.use(sinonChai);

describe('oauth', () => {
  const token = 'Bearer 04da4ae6-80a1-419b-824b-604e22f10d10';
  const next = spy();
  const req = {
    headers: {
      authorization: token,
    },
  };
  const mockResponse = () => {
    const res = {};
    res.status = stub().returns(res);
    res.json = stub().returns(res);
    return res;
  };

  const errorResponse = {
    status: 401,
    error: 'invalid_token',
    error_description: 'Invalid access token: 1adb78bf2-bdfa-4381-b882-804bad567f08',
  };

  it('should not call next when unauthorized', async () => {
    mock(UEF_MS_LOGIN_URL)
      .get('/user')
      .reply(401, errorResponse);
    await oauth(req, mockResponse(), next);
    expect(next).to.have.been.callCount(0);
  });

  it('should throw error when cannot connect to oauth server', async () => {
    mock(UEF_MS_LOGIN_URL)
      .get('/user')
      .replyWithError('Internal Server Error');

    try {
      await oauth(req, mockResponse(), next);
    } catch (e) {
      expect(e.message).to.contains('Internal Server Error');
    }
  });
});
