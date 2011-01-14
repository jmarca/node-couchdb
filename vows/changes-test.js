// var vows = require('vows'),
//   assert = require('assert'),
//   couchdb = require('../lib/couchdb');
//   
// var client = couchdb.createClient(),
//   db = client.db('node-couchdb-test');
// 
// vows.
//   describe('db').
//   addBatch({
//     'changesStream': {
//       topic: function() {
//         var callback = this.callback;
//         db.remove(function() {
//           db.create(function() {
//             var stream = db.changesStream();
//             stream.addListener('data', function(change) {
//               stream.close();
//               callback(null, change);
//             });
//             db.saveDoc({test: 1});
//           });
//         });
//       },
//       
//       'should allow retrieving changes through listeners': function(err, response) {
//         console.log(response);
//       }
//     }
//   }).
//   export(module);

  
  // .addListener('end', function() {
  //   callbacks.C = true;
  // })


// db.remove();
// db
//   .create(function(er) {
//     if (er) throw new Error(JSON.stringify(er));
//     
//     var stream = db.changesStream();
//     stream
//       .addListener('data', function(change) {
//         callbacks['B'+change.seq] = true;
//         if (change.seq == 2) {
//           stream.close();
//         }
//       })
//       .addListener('end', function() {
//         callbacks.C = true;
//       });
//   });
// 
// db.saveDoc({test: 1});
// db.saveDoc({test: 2});
// 
// db.changes({since: 1}, function(er, r) {
//   if (er) throw new Error(JSON.stringify(er));
//   callbacks.A = true;
//   assert.equal(2, r.results[0].seq);
//   assert.equal(1, r.results.length);
// });
