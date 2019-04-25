const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const should = chai.should();
const server = require('../');

chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('/reference', () => {
  describe('GET /reference/:group', () => {
    it('should response with status Not Found', (done) => {
      request(server)
        .get('/reference')
        .end((err, res) => {
          res.status.should.equal(404);
          done();
        });
    });

    it('should response with status Unauthorized', (done) => {
      request(server)
        .get('/reference/GENDER')
        .end((err, res) => {
          res.status.should.equal(401);
          done();
        });
    });
  });
});
