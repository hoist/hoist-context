'use strict';
import {
  extend,
  find,
  some
}
from 'lodash';
import Bluebird from 'bluebird';

class Context {
  constructor(properties) {
    extend(this, properties);
  }
  getClaims() {
    /* returns claims against anon, user, and bucket role */
    var claimList = [];
    if (!this.application) {
      return claimList;
    }
    if (!this.environment) {
      this.environment = 'live';
    }
    claimList = claimList.concat(this.application.anonymousPermissions[this.environment]);
    if (!this.user || !this.roles) {
      return claimList;
    }
    var userRole = find(this.roles, (role) => {
      return role._id === this.user.roles.mainRole && role.environment === this.environment;
    });
    if (userRole) {
      claimList = claimList.concat(userRole.claims);
    }
    if (!this.bucket) {
      return claimList;
    }
    var userBucketRole = find(this.user.roles.bucketRoles, (innerBucketRole) => {
      return innerBucketRole.bucket === this.bucket._id;
    });
    if (userBucketRole) {
      var bucketRole = find(this.roles, (role) => {
        return role._id === userBucketRole.role && role.environment === this.environment;
      });
      if (bucketRole) {
        claimList = claimList.concat(bucketRole.claims);
      }
    }
    return claimList;
  }
  hasClaim(claim) {
    return Promise.resolve().then(() => {
      if (!claim || !claim.key) {
        return false;
      }
      return some(this.getClaims(), (key) => {
        return key === claim.key;
      });
    });
  }
}
var _context;
Context.set = function (context, callback) {
  _context = context;
  return Bluebird.resolve(_context)
    .nodeify(callback);
};
Context.current = function () {
  return _context;
};

Context.get = function (callback) {
  return Bluebird.try(function () {
    if (!_context) {
      _context = new Context({});
    }
    return _context;
  }).nodeify(callback);
};

Context.claims = require('./claims');

module.exports = Context;
