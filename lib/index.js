'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = function () {
  function Context(properties) {
    _classCallCheck(this, Context);

    (0, _lodash.extend)(this, properties);
  }

  _createClass(Context, [{
    key: 'getClaims',
    value: function getClaims() {
      var _this = this;

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
      var userRole = (0, _lodash.find)(this.roles, function (role) {
        return role._id === _this.user.roles.mainRole && role.environment === _this.environment;
      });
      if (userRole) {
        claimList = claimList.concat(userRole.claims);
      }
      if (!this.bucket) {
        return claimList;
      }
      var userBucketRole = (0, _lodash.find)(this.user.roles.bucketRoles, function (innerBucketRole) {
        return innerBucketRole.bucket === _this.bucket._id;
      });
      if (userBucketRole) {
        var bucketRole = (0, _lodash.find)(this.roles, function (role) {
          return role._id === userBucketRole.role && role.environment === _this.environment;
        });
        if (bucketRole) {
          claimList = claimList.concat(bucketRole.claims);
        }
      }
      return claimList;
    }
  }, {
    key: 'hasClaim',
    value: function hasClaim(claim) {
      var _this2 = this;

      return Promise.resolve().then(function () {
        if (!claim || !claim.key) {
          return false;
        }
        return (0, _lodash.some)(_this2.getClaims(), function (key) {
          return key === claim.key;
        });
      });
    }
  }]);

  return Context;
}();

var _context;
Context.set = function (context, callback) {
  _context = context;
  return _bluebird2.default.resolve(_context).nodeify(callback);
};
Context.current = function () {
  return _context;
};

Context.get = function (callback) {
  return _bluebird2.default.try(function () {
    if (!_context) {
      _context = new Context({});
    }
    return _context;
  }).nodeify(callback);
};

Context.claims = require('./claims');

module.exports = Context;
//# sourceMappingURL=index.js.map
