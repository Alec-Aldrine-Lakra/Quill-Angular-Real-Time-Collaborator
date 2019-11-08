import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private email: String;
  private password: String;
  constructor(private router: Router, private auth: AuthService) {
    
  }

  ngOnInit() {
  }

  loginUser(form : any){

    let email = this.email;
    let password = this.password;
    if(email!='' && password!=''){
       this.auth.loginUser({email, password}).subscribe(res=>{
          if(!res.err){
            this.router.navigate(['editor']);
            localStorage.setItem('token', res.token);
          }
          else
            console.log(res.err);
       },err=>{
          console.log(err);
      })
    }
    else
      alert('Fields Empty');
  }
}
