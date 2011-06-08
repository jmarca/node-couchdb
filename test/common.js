var env = process.env;
var user = process.env.COUCHDB_USER || '';
var pass = process.env.COUCHDB_PASS || '' ;
var host = process.env.COUCHDB_HOST || '127.0.0.1' ;
var port = process.env.COUCHDB_PORT  || 5984;

var sys = require('sys');
global.p = sys.p;
global.puts = sys.puts;

global.couchdb = require('../lib/couchdb');
global.assert = require('assert');
global.checkCallbacks = function(callbacks) {
  for (var k in callbacks) {
    assert.ok(callbacks[k], 'Callback '+k+' fired');
  }
};

// Provide a port/host here if your local db has a non-default setup
GLOBAL.client = couchdb.createClient(port,host,user,pass);
