'use strict';
var _ = require('lodash');
var BBPromise = require('bluebird');
var cls = require('continuation-local-storage');
var namespace = cls.getNamespace('Hoist.context');
if (!namespace) {
  namespace = cls.createNamespace('Hoist.context');
}
var patchPromise = require('cls-bluebird');
patchPromise(namespace);

function Context(properties) {
  _.extend(this, properties);
}
Context.namespace = namespace;
Context.set = function (context, callback) {
  return BBPromise.try(function () {
    namespace.set('hoist-context', context);
    return context;
  }).nodeify(callback);
};
Context.get = function (callback) {
  return BBPromise.try(function () {
    var context = namespace.get('hoist-context');
    if (!context) {
      return Context.set(new Context());
    }
    return context;
  }).nodeify(callback);
};

Context.claims = require('./claims');
Context.prototype = {
  getClaims: function () {
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
    var userRole = _.find(this.roles, _.bind(function (role) {
      return role._id === this.user.roles.mainRole && role.environment === this.environment;
    }, this));
    if (userRole) {
      claimList = claimList.concat(userRole.claims);
    }
    if (!this.bucket) {
      return claimList;
    }
    var userBucketRole = _.find(this.user.roles.bucketRoles, _.bind(function findBucketRoleId(bucketRole) {
      return bucketRole.bucket === this.bucket._id;
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
  hasClaim: function (claim) {
    return BBPromise.try(function () {
      if (!claim || !claim.key) {
        return false;
      }
      return _.any(this.getClaims(), function (key) {
        return key === claim.key;
      });
    },[],this);
  }
};

module.exports = Context;
