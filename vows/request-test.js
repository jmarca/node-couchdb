// var vows = require('vows'),
//   assert = require('assert'),
//   couchdb = require('../lib/couchdb');
//   
// var client = couchdb.createClient();
// 
// vows.
//   describe('client').
//   addBatch({
//     'request': {
// 
//       'without method and options': {
//         topic: function() {
//           client.request('/_uuids', this.callback);
//         },
//         
//         'should return 1 uuid': function(err, response) {
//           assert.length(response.uuids, 1);
//         }
//       },
//       
//       'with option count': {
//         topic: function() {
//           client.request('/_uuids', {count: 2}, this.callback);
//         },
//         
//         'should return the number of uuids given by option count': function(err, response) {
//           assert.length(response.uuids, 2);
//         }
//       },
//       
//       'with method get and option count': {
//         topic: function() {
//           client.request('get', '/_uuids', {count: 3}, this.callback);
//         },
//         
//         'should return the number of uuids given by option count': function(err, response) {
//           assert.length(response.uuids, 3);
//         }
//       },
//       
//       'with path and options as a hash': {
//         topic: function() {
//           client.request({
//               path: '/_uuids',
//               query: {count: 4},
//             }, this.callback);
//         },
//         
//         'should still return the correct number of uuids': function(err, response) {
//           assert.length(response.uuids, 4);
//         }
//       },
//       
//       'with option full': {
//         topic: function() {
//           client
//             .request({
//               path: '/_uuids',
//               query: {count: 5},
//               full: true
//             }, this.callback);          
//         },
//         
//         'should return the headers': function(err, response) {
//           assert.ok('headers' in response);
//         }
//       },
//       
//       'with illegal method': {
//         topic: function() {
//           client.request('post', '/_uuids', this.callback);
//         },
//         
//         'should return a method not allowed error': function(err, response) {
//           assert.equal(err.error, 'method_not_allowed');
//         }
//       }
//     }
//   }).
//   export(module);