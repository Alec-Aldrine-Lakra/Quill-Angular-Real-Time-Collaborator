import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { LoginComponent } from './login/login.component';
import { EditorComponent } from './editor/editor.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path : '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path : 'login',
    component: LoginComponent
  },
  {
    path: 'editor',
    component: EditorComponent
  },
  {
     path: 'register',
     component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), QuillModule.forRoot()],
  exports: [RouterModule]
})
export class AppRoutingModule { }
