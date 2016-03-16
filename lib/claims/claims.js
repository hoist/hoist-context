'use strict';

var _ = require('lodash');

function Claim(desc) {
  _.extend(this, desc);
}
var Claims = {
  create: function create(desc) {
    var claim = new Claim(desc);
    Claims[claim.key] = claim;
    return claim;
  }
};

module.exports = Claims;
//# sourceMappingURL=claims.js.map
