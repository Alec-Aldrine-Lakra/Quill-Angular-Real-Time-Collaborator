import {ViewChild, Component, OnInit} from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import QuillCursors from 'quill-cursors';
import {SocketsService} from '../sockets.service';
import Quill from 'quill';
import 'quill-mention';
import jsondecoder from 'jsonwebtoken/decode.js'
Quill.register('modules/cursors', QuillCursors); 
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
  public modules: any;
  private token: any;
  private cursor: any;
  private cursorModule: any;
  ngOnInit(){
  }

  constructor()
  {
    this.token = jsondecoder(localStorage.getItem('token')) || null;
    this.modules = {
      cursors: {
        transformOnTextChange: true
      },
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        onSelect: (item, insertItem) => {
          const editor = this.editor.quillEditor as Quill
          insertItem(item) // necessary because quill-mention triggers changes as 'api' instead of 'user'
          editor.insertText(editor.getLength() - 1, '', 'user')
        },
        source: (searchTerm, renderList) => {
          const values = [
            { id: 1, value: 'Alec'},
            { id: 2, value: 'Irshad'},
            { id: 3, value: 'Anmol'},
            { id: 4, value: 'MunMun'},
            { id: 5, value:'Zoya'}
          ]
          if (searchTerm.length === 0) {
            renderList(values, searchTerm)
          } else {
            const matches = []
            values.forEach((entry) => {
              if (entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                matches.push(entry)
              }
            })
            renderList(matches, searchTerm)
          }
        }
      }
    }
  }

  editorCreated($event){
    this.cursorModule = this.editor.quillEditor.getModule('cursors');
    this.cursor = new Cursor(this.token.uid, this.token.name);
    socket.cursor_socket.addEventListener('message',res=>{
      let data = JSON.parse(res.data);
      if(localStorage.getItem(data.uid))
          this.cursorModule.moveCursor(data.id,data.range);
      else
          this.cursorModule.createCursor(data.uid,data.name, data.color,data.range);
      localStorage.setItem(data.uid, JSON.stringify(data));
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
    console.log('c');
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