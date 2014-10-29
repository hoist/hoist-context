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
    /* returns claims against anon, member, and bucket role */
    var claimList = [];
    if (!this.application) {
      return claimList;
    }
    if (!this.environment) {
      this.environment = 'live';
    }
    claimList = claimList.concat(this.application.anonymousPermissions[this.environment]);
    if (!this.member || !this.roles) {
      return claimList;
    }
    var memberRole = _.find(this.roles, _.bind(function (role) {
      return role._id === this.member.roles.mainRole && role.environment === this.environment;
    }, this));
    if (memberRole) {
      claimList = claimList.concat(memberRole.claims);
    }
    if (!this.bucket) {
      return claimList;
    }
    var memberBucketRole = _.find(this.member.roles.bucketRoles, _.bind(function findBucketRoleId(bucketRole) {
      return bucketRole.bucket === this.bucket._id;
    },this));
    if (memberBucketRole) {
      var bucketRole = _.find(this.roles, _.bind(function findBucketRole(role) {
        return role._id === memberBucketRole.role && role.environment === this.environment;
      }, this));
      if(bucketRole){
        claimList = claimList.concat(bucketRole.claims);
      }
    }
    return claimList;
  },
  hasClaim: function () {
  }
};

module.exports = Context;
