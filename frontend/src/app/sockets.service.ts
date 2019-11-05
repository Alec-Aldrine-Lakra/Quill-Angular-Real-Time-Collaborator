import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  connection: any;
  sharedb: any;
  socket:any;
  doc: any;

  constructor() {
    this.sharedb = require('sharedb/lib/client');
    this.sharedb.types.register(require('rich-text').type);
    // Open WebSocket connection to ShareDB server
    this.socket = new WebSocket('ws://localhost:8080');
    this.connection = new this.sharedb.Connection(this.socket);
    this.doc = this.connection.get('examples', 'richtext');
  }
}
