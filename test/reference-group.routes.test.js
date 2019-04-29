
const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const should = chai.should();
const server = require('../');

chai.use(chaiHttp);

process.env.PORT = 3001;

describe('/GraphQL', () => {
  describe('availableReferenceAccessByGroup', () => {
    it('should response with status Unauthorized', (done) => {
      request(server)
        .post('/graphql')
        .send({ query: '{ availableReferenceAccessByGroup: (referenceGroup: "GENDER") { id code name }}' })
        .end((err, res) => {
          res.status.should.equal(401);
          done();
        });
    });
  });
});
