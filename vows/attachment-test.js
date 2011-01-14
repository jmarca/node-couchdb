var vows = require('vows'),
  assert = require('assert'),
  couchdb = require('../lib/couchdb');
  
var client = couchdb.createClient(),
  db = client.db('node-couchdb-test'),
  attachment = null, rev = null;

vows.
  describe('db with attachments').
  addBatch({
    'a clean db': {
      topic: function() {
        db.remove();
        db.create();
        db.exists(this.callback);
      },
      
      'should exist': function(err, response) {
        assert.isTrue(response);
      },
      
      'toAttachment': {
        topic: function() {
          couchdb.toAttachment(__dirname + '/fixtures/logo.png', this.callback);
        },
        
        'should return an attachable object': function(err, _attachment) {
          attachment = _attachment;
          assert.equal(attachment.content_type, 'image/png');
          assert.equal(attachment.data.length, 4016);
        },
        
        'when being saved': {
          topic: function() {
            db.saveDoc('logo-doc', {
              name: 'The Logo',
              _attachments: {
                'logo.png': attachment
              }
            }, this.callback);
          },
          
          'should return the id of the new document': function(err, response) {
            assert.equal('logo-doc', response.id);
          },
          
          'when being retrieved': {
            topic: function() {
              db.getAttachment('logo-doc', 'logo.png', this.callback)
            },
            
            'should return the attachment': function(err, response) {
              assert.equal(response.length, 3010);
            }
          }
        }
      },

      'saveAttachment': {
        topic: function() {
          db.saveAttachment(
            __dirname + '/fixtures/logo.png',
            'logo-2',
            this.callback);
        },
        
        'should return the id of the document': function(err, response) {
          assert.equal(response.id, 'logo-2');
          rev = response.rev;
        },
        
        'when removing the attachment': {
          topic: function() {
            db.removeAttachment('logo-2', 'logo.png', rev, this.callback);
          },
          
          'should return ok': function(err, response) {
            assert.isTrue(response.ok);
          }
        }
      }
    }
  }).
  export(module);