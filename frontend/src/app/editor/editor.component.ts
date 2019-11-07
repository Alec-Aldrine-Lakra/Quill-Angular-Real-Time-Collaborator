import {ViewChild, Component, OnInit} from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import QuillCursors from 'quill-cursors';
import {SocketsService} from '../sockets.service';
import {HttpClient} from '@angular/common/http';
import Quill from 'quill';
import 'quill-mention';
import jsondecoder from 'jsonwebtoken/decode.js'
Quill.register('modules/cursors', QuillCursors);
const Tooltip = Quill.import('ui/tooltip'); 

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})

export class EditorComponent implements OnInit{
  @ViewChild(QuillEditorComponent, { static: true })
  editor: QuillEditorComponent;
  content = '';
  myTooltip:any;
  public modules: any;
  private socket: any;
  private flag = 0;
  private http: HttpClient;
  private uname: String;
  ngOnInit(){
    this.uname = jsondecoder(localStorage.getItem('token')).name;
    console.log(this.uname);
  }

  constructor()
  {
    this.socket = new SocketsService();
    
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
    this.socket.doc.subscribe((err)=>{ // Get initial value of document and subscribe to changes
      if(err) throw err;
       $event.setContents(this.socket.doc.data);
      this.socket.doc.on('op', (op, source)=>{
        if (source === 'quill') return;
        $event.updateContents(op);
      });
    });
  }

  logChanged($event)
  { 
    //console.log('hey');
    if ($event.source !== 'user') return;
    this.socket.doc.submitOp($event.delta, {source: 'quill'});
    if(this.myTooltip)
      this.myTooltip.hide();
    this.myTooltip = new Tooltip(this.editor.quillEditor);
    this.myTooltip.root.innerHTML = this.uname;
    //myTooltip.style.padding = '5px';
    let s = this.editor.quillEditor.getSelection();
    if(s){
      let bounds = this.editor.quillEditor.getBounds(s.index);
      console.log(bounds);
      //this.myTooltip.root.style.top-=10;
      this.myTooltip.show();
      this.myTooltip.position(bounds);
    }
     
  }
}
