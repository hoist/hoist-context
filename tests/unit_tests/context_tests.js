'use strict';
var Context = require('../../lib');
var expect = require('chai').expect;
var BBPromise = require('bluebird');
var sinon = require('sinon');

describe('Context', function () {
  describe('session management', function () {
    it('returns same context on chain', function () {
      Context.namespace.run(function () {
        Context.get()
          .then(function (context) {
            context.name = 'I set this name';
          }).then(function () {
            return Context.get();
          }).then(function (context) {
            expect(context.name).to.eql('I set this name');
          }).done();
      });
    });
    it('returns different chain', function (done) {
      //we haven't set context here
      var contexts = [];

      function assertContext(context) {
        contexts.push(context);
        if (contexts.length === 2) {
          expect(contexts[0].name).to.not.eql(contexts[1].name);
          done();
        }
      }
      //run it twice
      BBPromise.try(function () {
        Context.namespace.run(function () {
          Context.get().then(function (context) {
            context.name = 1;
            return Context.get();
          }).then(function (context) {
            assertContext(context);
          }).done();
        });

        Context.namespace.run(function () {
          Context.get().then(function (context) {
            context.name = 2;
            return Context.get();
          }).then(function (context) {
            assertContext(context);
          }).done();
        });
      });
    });
  });
  describe('#getClaims', function () {
    describe('if no application set', function () {
      var context = new Context({});
      it('returns empty list', function () {
        return expect(context.getClaims()).to.eql([]);
      });
    });
    describe('if application and no user', function () {
      var context = new Context({
        environment: 'dev',
        application: {
          anonymousPermissions: {
            live: ['claim-1', 'claim-3'],
            dev: ['claim-1', 'claim-2']
          }
        }
      });

      it('returns all anonymous claims', function () {
        expect(context.getClaims()).to.eql(['claim-1', 'claim-2']);
      });
    });
    describe('if application and user but no bucket', function () {
      var context = new Context({
        roles: [{
          _id: 'user',
          environment: 'dev',
          application: 'application',
          claims: ['claim-3', 'claim-4']
        }, {
          _id: 'user',
          environment: 'live',
          application: 'application',
          claims: ['claim-5', 'claim-6']
        }, {
          _id: 'admin',
          environment: 'live',
          application: 'application',
          claims: ['claim-7', 'claim-8']
        }],
        application: {
          _id: 'application',
          anonymousPermissions: {
            dev: ['claim-1', 'claim-2']
          }
        },
        environment: 'dev',
        user: {
          roles: {
            mainRole: 'user',
            bucketRoles: [{
              bucket: 'bucket1',
              role: 'admin'
            }]
          }
        }
      });

      it('returns all user and anon claims', function () {
        expect(context.getClaims()).to.eql(['claim-1', 'claim-2', 'claim-3', 'claim-4']);
      });
    });
    describe('if application and user and bucket', function () {
      var context = new Context({
        roles: [{
          _id: 'user',
          environment: 'dev',
          application: 'application',
          claims: ['claim-3', 'claim-4']
        }, {
          _id: 'user',
          environment: 'live',
          application: 'application',
          claims: ['claim-5', 'claim-6']
        }, {
          _id: 'admin',
          environment: 'live',
          application: 'application',
          claims: ['claim-7', 'claim-8']
        }],
        application: {
          _id: 'application',
          anonymousPermissions: {
            dev: ['claim-1', 'claim-2'],
            live: ['claim-9', 'claim-10']
          }
        },
        user: {
          roles: {
            mainRole: 'user',
            bucketRoles: [{
              bucket: 'bucket1',
              role: 'admin'
            }]
          }
        },
        bucket: {
          _id: 'bucket1'
        }

      });
      it('returns all user, bucket and anon claims', function () {
        expect(context.getClaims()).to.eql(['claim-9', 'claim-10', 'claim-5', 'claim-6', 'claim-7', 'claim-8']);
      });
    });
  });
  describe('#hasClaim', function () {
    var context = new Context();
    var claim = Context.claims.create({
      key: 'TestClaim',
      relatedToApi: 'test',
      name: 'A Test Claim',
      Description: 'This is a test claim',
      defaultRoleValue: true,
      defaultAnonValue: true
    });
    var stub;
    before(function () {
      stub = sinon.stub(context, 'getClaims');
    });
    after(function () {
      context.getClaims.restore();
    });
    it('returns true if claim in getClaims', function () {
      stub.returns(['claim-1', 'claim-2', 'TestClaim', 'claim-3']);
      return expect(context.hasClaim(claim)).to.eventually.become(true);
    });
    it('returns false if claim not in getClaims', function () {
      stub.returns(['claim-1', 'claim-2', 'claim-3']);
      return expect(context.hasClaim(claim)).to.eventually.become(false);
    });
    it('returns false if not passed a valid claim', function () {
      return BBPromise.all([
        expect(context.hasClaim()).to.eventually.become(false),
        expect(context.hasClaim({})).to.eventually.become(false),
      ]);
    });
  });
});
