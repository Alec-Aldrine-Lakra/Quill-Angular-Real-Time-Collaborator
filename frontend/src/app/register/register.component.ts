import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private email: string;
  private password: string;
  private fname:string;
  private lname:string;
  constructor(private router: Router, private auth: AuthService) {
    
  }

  ngOnInit() {
  }

  loginUser(form : any){

    let fname = this.fname, lname = this.lname, email = this.email, password = this.password;
    if(email!='' && password!=''){
       this.auth.registerUser({fname, lname, email, password}).subscribe(res=>{
         if(!res.err){    
          this.router.navigate(['login']);
         }
         else
            alert(res.err);
       },err=>{
          console.log(err);
      })
    }
    else
      alert('Fields Empty');
  }

}
