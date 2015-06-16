'use strict';
var _ = require('lodash');
var BBPromise = require('bluebird');

function Context(properties) {
  _.extend(this, properties);
}
var _context;
Context.set = function(context, callback) {
  return BBPromise.try(function() {
    _context = context;
    return _context;
  }).nodeify(callback);
};
Context.get = function(callback) {
  return BBPromise.try(function() {
    if (!_context) {
      return _context;
    }
  }).nodeify(callback);
};

Context.claims = require('./claims');
Context.prototype = {
  getClaims: function() {
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
    var userRole = _.find(this.roles, _.bind(function(role) {
      return role._id === this.user.roles.mainRole && role.environment === this.environment;
    }, this));
    if (userRole) {
      claimList = claimList.concat(userRole.claims);
    }
    if (!this.bucket) {
      return claimList;
    }
    var userBucketRole = _.find(this.user.roles.bucketRoles, _.bind(function findBucketRoleId(innerBucketRole) {
      return innerBucketRole.bucket === this.bucket._id;
    }, this));
    if (userBucketRole) {
      var bucketRole = _.find(this.roles, _.bind(function findBucketRole(role) {
        return role._id === userBucketRole.role && role.environment === this.environment;
      }, this));
      if (bucketRole) {
        claimList = claimList.concat(bucketRole.claims);
      }
    }
    return claimList;
  },
  hasClaim: function(claim) {
    return BBPromise.try(function() {
      if (!claim || !claim.key) {
        return false;
      }
      return _.any(this.getClaims(), function(key) {
        return key === claim.key;
      });
    }, [], this);
  }
};

module.exports = Context;
