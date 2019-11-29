import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import QuillCursors from 'quill-cursors';
import { ImageResize } from 'quill-image-resize';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import { QuillConfig, QuillModule } from "ngx-quill";
import QuillBetterTable from "quill-better-table";
import 'quill-mention';
Quill.register({"modules/better-table" : QuillBetterTable},true);
Quill.register({'modules/cursors': QuillCursors},true); 
//Quill.register({'modules/imageResize': ImageResize},true);

const quillConfig: QuillConfig = {
  modules: {
    //imageResize:{},
    cursors: {
      transformOnTextChange: true
    },
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      onSelect: (item, insertItem) => {
        const editor = Quill
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
    },
    table: false, // disable table module
    "better-table": {
      operationMenu: {
        items: {
          unmergeCells: {
            text: "Another unmerge cells name"
          }
        },
        color: {
          colors: ["#fff", "red", "rgb(0, 0, 0)"], // colors in operationMenu
          text: "Background Colors" // subtitle
        }
      }
    },
    keyboard: {
      bindings: QuillBetterTable.keyboardBindings
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EditorComponent,
    RegisterComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    QuillModule.forRoot(quillConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
