import {ViewChild, Component, OnInit} from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';

import {SocketsService} from '../sockets.service';
import jsondecoder from 'jsonwebtoken/decode.js';

const socket = new SocketsService();
const chance = require('chance').Chance();



@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})

export class EditorComponent implements OnInit{
  @ViewChild(QuillEditorComponent, { static: true })
  editor: QuillEditorComponent;
  content = '';
  private token: any;
  private cursor: any;
  private cursorModule: any;
  ngOnInit(){
  }

  constructor()
  {
    this.token = jsondecoder(localStorage.getItem('token')) || null;
  }

  editorCreated($event){
    this.cursorModule = this.editor.quillEditor.getModule('cursors');
    this.cursor = new Cursor(this.token.uid, this.token.name);
    socket.cursor_socket.addEventListener('message',res=>{
      let data = JSON.parse(res.data);
      if(sessionStorage.getItem(data.uid))
          this.cursorModule.moveCursor(data.uid,data.range);
      else
          this.cursorModule.createCursor(data.uid,data.name, data.color,data.range);
      sessionStorage.setItem(data.uid, JSON.stringify(data));
    })

    socket.doc.subscribe((err)=>{ // Get initial value of document and subscribe to changes
      if(err) throw err;
       $event.setContents(socket.doc.data);
        socket.doc.on('op', (op, source)=>{
        if (source === 'quill') return;
        $event.updateContents(op);
      });
    });
  }

  logChanged($event)
  { 
    if ($event.source !== 'user') return;
    socket.doc.submitOp($event.delta, {source: 'quill'});
  }
  selectionUpdate($event)
  {
    this.cursor.updateCursor(this.editor.quillEditor.getSelection());
  }
}

class Cursor{

  private name: string;
  private uid: string;
  private color: string;
  constructor(uid: string, name: string){
    this.name = name;
    this.uid = uid;
    this.color = chance.color({format : 'hex'});
  }

  updateCursor(range){
    socket.cursor_socket.send(JSON.stringify({name: this.name,uid: this.uid,color: this.color, range}))
  }

}