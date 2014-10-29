'use strict';
var _ = require('lodash');

function Claim(desc) {
  _.extend(this,desc);
}
var Claims = {
  create: function (desc) {
    var claim = new Claim(desc);
    Claims[claim.key] = claim;
    return claim;
  }
};


module.exports = Claims;
