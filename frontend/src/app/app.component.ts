import {/*ChangeDetectionStrategy,*/ ViewChild, Component} from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import QuillCursors from 'quill-cursors';

/*interface Quill{
  getModule(moduleName: string);
}
interface BetterTableModule {
  insertTable(rows: number, columns: number): void;
}*/

import {SocketsService} from './sockets.service';
import Quill from 'quill';
import 'quill-mention';
Quill.register('modules/cursors', QuillCursors);
/*const parchment = Quill.import('parchment')
const block = parchment.query('block')
block.tagName = 'DIV'
// or class NewBlock extends Block {} NewBlock.tagName = 'DIV'
Quill.register(block /* or NewBlock *//*, true)*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  //changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent{

  /*public quill: Quill;
  private get tableModule(): BetterTableModule {
    return this.quill.getModule("better-table");
  }
  public editorCreated(event: Quill): void {
    this.quill = event;
    // Example on how to add new table to editor
    this.addNewtable();
  }
  private addNewtable(): void {
    this.tableModule.insertTable(3, 3);
  }*/
  
  @ViewChild(QuillEditorComponent, { static: true }) editor: QuillEditorComponent
  content = '';
  modules = { 
    cursors: {
      template: '<div class="custom-cursor">...</div>',
      hideDelayMs: 5000,
      hideSpeedMs: 0,
      selectionChangeSource: null,
      transformOnTextChange: true,
    },
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      onSelect: (item, insertItem) => {
        const editor = this.editor.quillEditor as Quill
        insertItem(item)
        // necessary because quill-mention triggers changes as 'api' instead of 'user'
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
  };
  private socket: any;
  constructor(){
    this.socket = new SocketsService();
  }
  editorCreated($event){
    // Get initial value of document and subscribe to changes
    this.socket.doc.subscribe((err)=>{
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
    if ($event.source !== 'user') return;
    this.socket.doc.submitOp($event.delta, {source: 'quill'});
  }
}