var http = require('http');
var express = require('express');
var ShareDB = require('@teamwork/sharedb');
var richText = require('rich-text');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
ShareDB.types.register(richText.type);
const mongodb = require('mongodb');
const db = require('@teamwork/sharedb-mongo')({mongo: function(callback) {
  mongodb.connect('mongodb://localhost:27017/test',{useUnifiedTopology: true},callback);
}});
const backend = new ShareDB({db, disableDocAction: true, disableSpaceDelimitedActions: true});

createDoc(startServer);

// Create initial document then fire callback
function createDoc(callback) {
  var connection = backend.connect();
  var doc = connection.get('examples', 'richtext'); //examples collection with id = 'richtext'
  doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create([{insert: 'Hi!'}], 'rich-text', callback);
      return;
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();
  app.use(express.static('static'));
  app.use(express.static('node_modules/quill/dist'));
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws) {
    console.log('Started Listening');
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(8080);
  console.log('Listening on http://localhost:8080');
}
