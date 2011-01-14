var vows = require('vows'),
  assert = require('assert'),
  couchdb = require('../lib/couchdb');
  
var client = couchdb.createClient(),
  db = client.db('node-couchdb-test');

vows.
  describe('couchdb').
  addBatch({
    'toQuery': {
      topic: couchdb.toQuery({
        key: 'bar',
        very: true,
        stale: 'ok'
      }),
      
      'should return the parameters in a format usable for querying couchdb': function(topic) {
        assert.equal(topic, 'key=%22bar%22&very=true&stale=ok');
      }
    }
  }).
  export(module);