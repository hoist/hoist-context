'use strict';
var _ = require('lodash');

function Context(properties){
  _.extend(this,properties);
}

Context.get = function(){

};

Context.claims = require('./claims');

Context.prototype = {
  getClaims:function(){

  }
};

module.exports = Context;
