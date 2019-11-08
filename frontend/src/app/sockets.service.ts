import { Injectable } from '@angular/core';
import ReconnectingWebSocket from 'reconnecting-websocket';
@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  connection: any;
  sharedb: any;
  db_socket:any;
  cursor_socket: any;
  doc: any;

  constructor() {
    this.sharedb = require('sharedb/lib/client');
    this.sharedb.types.register(require('rich-text').type);  // Open WebSocket connection to ShareDB server
    this.db_socket = new ReconnectingWebSocket('ws://localhost:8800/sharedb');
    this.cursor_socket = new ReconnectingWebSocket('ws://localhost:8800/cursors');
    this.connection = new this.sharedb.Connection(this.db_socket);
    this.doc = this.connection.get('examples', 'richtext');
  }
}
