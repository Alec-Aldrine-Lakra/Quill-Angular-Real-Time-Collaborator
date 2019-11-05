import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes), QuillModule.forRoot()],
  exports: [RouterModule]
})
export class AppRoutingModule { }
