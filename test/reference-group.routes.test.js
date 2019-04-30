
const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const nock = require('nock');

const { expect } = chai;
const server = require('../');
const { UEF_MS_LOGIN_URL } = require('../src/common/constant');
const { availableReferenceAccessByGroup } = require('../src/services/reference-group.service');

chai.use(chaiHttp);

describe('/GraphQL', () => {
  describe('availableReferenceAccessByGroup', () => {
    it('should response with status Unauthorized', (done) => {
      request(server)
        .post('/graphql')
        .send({ query: '{ availableReferenceAccessByGroup: (referenceGroup: "GENDER") { id code name }}' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('should call availableReferenceAccessByGroup service when oauth is successfully', (done) => {
      nock(UEF_MS_LOGIN_URL)
        .get('/user')
        .reply(200, []);


      request(server)
        .post('/graphql')
        .send({ query: '{ availableReferenceAccessByGroup: (referenceGroup: "GENDER") { id code name }}' });
      expect(availableReferenceAccessByGroup).to.have.been.called();
    });
  });
});
