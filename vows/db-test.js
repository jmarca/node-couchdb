var vows = require('vows'),
  assert = require('assert'),
  couchdb = require('../lib/couchdb');
  
var client = couchdb.createClient(),
  db = client.db('node-couchdb-test'),
  rev = null;

vows.
  describe('db').
  addBatch({
    'create': {
      topic: function() {
        var callback = this.callback;
        
        db.create(function() {
          db.exists(callback);
        });
      },
      
      'should create the database': function(err, response) {
        assert.isTrue(response);
      },
      
      'should be removable': {
        topic: function() {
          var callback = this.callback;
                
          db.remove(function() {
            db.exists(callback);
          });
        },
      
        'should delete the database': function(err, response) {
          assert.isFalse(response);
        }        
      }      
    }
  }).
  addBatch({
    'removing the documents': {
      topic: function() {
        var callback = this.callback;
        db.create(function() {
          db.saveDoc('abc123', {hello: 'abc'}, function(err, response) {
            db.removeDoc('abc123', response.rev, callback);
          });
        });
      },

      'should be successful': function(err, response) {
        assert.isTrue(response.ok);
      }
    }
  }).
  addBatch({
    'retrieving information': {
      topic: function() {
        var callback = this.callback;
        db.remove(function() {
          db.create(function() {
            db.saveDoc('abc123', {hello: 'abc'}, function(err, response) {
              db.info(callback);
            });
          });          
        });
      },
      
      'should return the number of documents': function(err, response) {
        assert.equal(response.doc_count, 1);
      },
      
      'compact': {
        topic: function() {
          db.compact(this.callback);
        },

        'should be successful': function(err, response) {
          assert.isTrue(response.ok);
        }
      }
    }    
  }).
  addBatch({
    'saving a document with a given id': {
      topic: function() {
        db.create();
        db.saveDoc('12345', {hello: 'abc'}, this.callback);
      },
    
      'should return the document with the given id': function(err, response) {
        assert.equal(response.id, '12345');
        rev = response.rev;
      },
      
      'retrieving the document': {
        topic: function() {
          db.getDoc('12345', this.callback);
        },

        'should return the saved document': function(err, response) {
          assert.equal(response.hello, 'abc');
        }
      },
      
      'copying without a destination revision': {
        topic: function() {
          db.copyDoc('12345', '67890', this.callback);
        },

        'should a new id and the same rev as the source doc': function(err, response) {
          assert.isString(response.id);
          assert.equal(response.rev, rev);
        }
      },
      
      'copying with a destination revision': {
        topic: function() {
          db.copyDoc('12345', 'abcdef', rev, this.callback);
        },
        
        'should result in a new revision number': function(err, response) {
          assert.notEqual(response.rev, rev);
        }        
      }
    },
    
    'saving a document without id': {
      topic: function() {
        db.saveDoc({}, this.callback);
      },
      
      'should assign an id of its own': function(err, response) {
        assert.isString(response.id)
      }      
    }    
  }).
  addBatch({
    'get all documents': {
      topic: function() {
        var callback = this.callback;
        db.remove(function() {
          db.create(function() {
            db.saveDoc({hello: 'abc'}, function() {
              db.saveDoc({hello: 'abc'}, function() {
                db.saveDoc({hello: 'abc'}, function() {
                  db.allDocs(callback);
                });
              });
            });
          });
        });
      },
      
      'should return 3 documents and a total_rows value': function(err, response) {
        assert.length(response.rows, 3);
        assert.equal(response.total_rows, 3);
      },
      
      'with query options': {
        topic: function() {
          db.allDocs({limit: 2}, this.callback);
        },
        
        'should return the result set filtered by the query options': function(err, response) {
          assert.length(response.rows, 2);
        }
      },
      
      // 'by seq': {
      //   topic: function() {
      //     db.allDocsBySeq(this.callback);
      //   },
      //   
      //   'should be successful': function(err, response) {
      //     console.log(err, response)
      //     assert.isArray(response.rows);
      //   }
      // }      
    }
  }).
  export(module);





// db
//   .bulkDocs({
//     docs: [
//       {_id: '1'},
//       {_id: '2'},
//     ]
//   }, function(er, r) {
//     if (er) throw new Error(JSON.stringify(er));
//     callbacks.N = true;
//     assert.equal('1', r[0].id);
//     assert.equal('2', r[1].id);
//   });
// 
// // Test temp views
// db
//   .tempView({
//     map: function() {
//       emit(null, null);
//     }
//   }, {include_docs: true}, function(er, r) {
//     if (er) throw new Error(JSON.stringify(er));
//     callbacks.O = true;
//     assert.ok('total_rows' in r);
//   });
// 
// // Test view cleanup
// db
//   .viewCleanup(function(er, r) {
//     if (er) throw new Error(JSON.stringify(er));
//     callbacks.P = true;
//     assert.ok(r.ok);
//   });
// 
// // Test save design doc
// db
//   .saveDesign('nice', {
//     views: {
//       one: {
//         map: function() {
//           emit(null, null)
//         }
//       }
//     }
//   }, function(er, r) {
//     if (er) throw new Error(JSON.stringify(er));
//     callbacks.Q = true;
//     assert.ok('ok' in r);
//     assert.ok('_design/nice', r.id);
//   });
// 
// // Try alternative syntax
// db
//   .saveDesign({
//     _id: 'other',
//     views: {
//       example: {
//         map: function() {
//           emit(null, null)
//         }
//       }
//     }
//   }, function(er, r) {
//     if (er) throw new Error(JSON.stringify(er));
//     callbacks.R = true;
//     assert.ok('ok' in r);
//     assert.ok('_design/other', r.id);
//   });
// 
// // Test compact on design
// db
//   .compact('nice', function(er, r) {
//     if (er) throw new Error(JSON.stringify(er));
//     callbacks.S = true;
//     assert.ok('ok' in r);
//   });
// 
// // Test view querying
// db
//   .view('nice', 'one', {limit: 1}, function(er, r) {
//     if (er) throw new Error(JSON.stringify(er));
//     callbacks.T = true;
//     assert.equal(1, r.rows.length);
//   });
