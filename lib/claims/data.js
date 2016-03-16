'use strict';

var Claims = require('./claims');

exports.GlobalRead = Claims.create({
  key: 'DataGlobalRead',
  relatedToApi: 'data',
  name: 'Read Global Data',
  Description: 'User can fetch global data from the Hoist store',
  defaultRoleValue: true,
  defaultAnonValue: true
});
exports.GlobalWrite = Claims.create({
  key: 'DataGlobalWrite',
  relatedToApi: 'data',
  name: 'Write Global Data',
  Description: 'User can write global data to the Hoist store',
  defaultRoleValue: true,
  defaultAnonValue: true
});
exports.GlobalDelete = Claims.create({
  key: 'DataGlobalDelete',
  relatedToApi: 'data',
  name: 'Delete Global Data',
  Description: 'User can delete global data from the Hoist store',
  defaultRoleValue: false,
  defaultAnonValue: false
});
exports.Read = Claims.create({
  key: 'DataRead',
  relatedToApi: 'data',
  name: 'Read Data',
  Description: 'User can fetch data from the Hoist store',
  defaultRoleValue: true,
  defaultAnonValue: true
});
exports.Write = Claims.create({
  key: 'DataWrite',
  relatedToApi: 'data',
  name: 'Write Data',
  Description: 'User can write data to the Hoist store',
  defaultRoleValue: true,
  defaultAnonValue: true
});
exports.Delete = Claims.create({
  key: 'DataDelete',
  relatedToApi: 'data',
  name: 'Delete Data',
  Description: 'User can delete data from the Hoist store',
  defaultRoleValue: false,
  defaultAnonValue: false
});
//# sourceMappingURL=data.js.map
