const sinon = require('sinon');
const mock = require('nock');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const { UEF_MS_LOGIN_URL, MASTER_DATA_URL } = require('../../src/common/constant');
const redisClient = require('../../src/config/redis');
const logger = require('../../src/common/logger');

sinon.stub(logger, 'info');


chai.use(chaiHttp);

const server = require('../..');

describe('/reference-group-resolver', () => {
  const responseData = [
    {
      id: 31,
      name: 'Laki-Laki',
      code: 'L',
      referenceGroup: 'GENDER',
      isAlternateEntry: false,
    },
    {
      id: 30,
      name: 'Perempuan',
      code: 'P',
      referenceGroup: 'GENDER',
      isAlternateEntry: false,
    },
  ];

  beforeEach((done) => {
    mock(UEF_MS_LOGIN_URL)
      .get('/user')
      .reply(200, { access_token: '04da4ae6-80a1-419b-824b-604e22f10d10' });
    done();
  });

  it('should response with status OK when application is running', async () => {
    const result = await chai.request(server).get('/');
    expect(result.status).to.equal(200);
    expect(result.body.message).to.equal('Application is running');
  });

  it('should return data referenceGroup from API when data does not exist on redis', async () => {
    mock(MASTER_DATA_URL)
      .post('/graphql')
      .reply(200, { data: { availableReferenceAccessByGroup: responseData } });

    const result = await chai.request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer')
      .send({
        query: '{\n'
          + '  availableReferenceAccessByGroup(referenceGroup: "GENDER") {\n'
          + '    id\n'
          + '    name\n'
          + '    code\n'
          + '    referenceGroup\n'
          + '    isAlternateEntry\n'
          + '  }\n'
          + '}',
      });

    expect(result.status).to.equal(200);
    expect(result.body.data.availableReferenceAccessByGroup).to.eql(responseData);
  });

  it('should return data referenceGroup from Redis Cache when data exist on redis', async () => {
    await redisClient.setAsync('GENDER', JSON.stringify(responseData));

    const result = await chai.request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer')
      .set('Accept', 'application/json')
      .send({
        query: '{\n'
          + '  availableReferenceAccessByGroup(referenceGroup: "GENDER") {\n'
          + '    id\n'
          + '    name\n'
          + '    code\n'
          + '    referenceGroup\n'
          + '    isAlternateEntry\n'
          + '  }\n'
          + '}',
      });
    expect(result.status).to.equal(200);
    expect(result.body.data).to.eql({ availableReferenceAccessByGroup: responseData });
  });
});
