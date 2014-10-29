'use strict';
//claims should be positive 'can do something not cannot do something'
//claims should be singular unless always about something plural

var Claims = require('./claims');

Claims.data = require('./data');
module.exports = Claims;

/*
[{
  name: 'Read Data',
  key: 'read-data',
  api: 'data',
  dataGranular: true,
  anonAllowed: true,
  defaultValue: true
}, {
  name: 'Write Data',
  key: 'write-data',
  api: 'data',
  dataGranular: true,
  anonAllowed: true,
  defaultValue: true
}, {
  name: 'Sign Up',
  key: 'create-user',
  api: 'auth',
  globalOnly: true,
  anonAllowed: true,
  defaultValue: true
}, {
  name: 'Invite User',
  key: 'invite-user',
  api: 'auth',
  defaultValue: true
}, {
  name: 'Change User\'s Role',
  key: 'change-role',
  api: 'auth',
  defaultValue: false
}, {
  name: 'Send Notification',
  key: 'send-notification',
  api: 'notify',
  anonAllowed: true,
  globalOnly: true,
  defaultValue: true
}, {
  name: 'Upload File',
  key: 'upload-file',
  api: 'file',
  default: true,
  globalOnly: true,
  anonAllowed: true
}, {
  name: 'Read File',
  key: 'read-file',
  api: 'file',
  default: true,
  globalOnly: true,
  anonAllowed: true
}, {
  name: 'Use Connector',
  key: 'use-connector',
  api: 'proxy',
  default: false,
  globalOnly: true
}, {
  name: 'Create Bucket',
  key: 'create-bucket',
  api: 'bucket',
  globalOnly: true,
  default: true
}, {
  name: 'View Members in Bucket',
  key: 'view-bucket-member',
  api: 'bucket',
  default: false
}, {
  name: 'Delete Bucket',
  key: 'delete-bucket',
  api: 'bucket',
  default: false
}, {
  name: 'View Bucket Meta Data',
  key: 'view-bucket',
  api: 'bucket',
  default: false
}, {
  name: 'Update Bucket Meta Data',
  key: 'update-bucket',
  api: 'bucket',
  default: false
}];*/
