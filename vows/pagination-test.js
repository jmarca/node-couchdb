var vows = require('vows'),
  assert = require('assert'),
  couchdb = require('../lib/couchdb');
  
var client = couchdb.createClient(),
  db = client.db('node-couchdb-test');

(function beforeAll(db) {
  db.remove();
  db.create();

  db.saveDesign('nice', {
    views: {
      one: {
        map: function(doc) {
          emit(doc._id, doc.hello);
        }
      }
    }
  }, function(er, r) { if (er) throw new Error(JSON.stringify(er)); });

  for(i = 1; i <= 72; i+=1) {
    db.saveDoc({hello: i}, function(er, r) {
      if (er) throw new Error(JSON.stringify(er));
    });  
  }  
})(db);

vows.
  describe('client').
  addBatch({
    'paginate': {
      
      'without any options': {
        topic: function() {
          db.paginate('nice', 'one', this.callback);
        },
        
        'should return 30 results': function(err, response) {
          assert.length(response.rows, 30);
        },
        
        'should return the first results': function(err, response) {
          assert.equal(response.rows[0].value, 1);
          assert.equal(response.rows[1].value, 2);
        },
        
        'should return the total number of rows': function(err, response) {
          assert.equal(response.total_rows, 72);
        },
        
        'should return the per page value': function(err, response) {
          assert.equal(response.per_page, 30);
        },
        
        'should return the current page': function(err, response) {
          assert.equal(response.page, 1);
        },
        
        'should return the total number of pages': function(err, response) {
          assert.equal(response.total_pages, 3);
        }
      },
      
      'with page and per_page options': {
        topic: function() {
          db.paginate('nice', 'one', {per_page: 10, page: 2}, this.callback);
        },
        
        'should return 10 results': function(err, response) {
          assert.length(response.rows, 10);
        },
        
        'should return the second 10 results': function(err, response) {
          assert.equal(response.rows[0].value, 11);
          assert.equal(response.rows[1].value, 12);
        }
      },
      
      'with other options': {
        topic: function() {
          db.paginate('nice', 'one', {limit: 2}, this.callback);
        },
        
        'should return the docs determined by the other options, not the defaults': function(err, response) {
          assert.length(response.rows, 2);
        }
      }
    }
  }).
  export(module);