import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _loginUrl: string;
  private _registerUrl: string;
  constructor(private http: HttpClient) {
     this._loginUrl = 'http://localhost:8800/login';
     this._registerUrl = 'http://localhost:8800/register';
  }
  registerUser(user){
    return this.http.post<any>(this._registerUrl, user);
  }
  loginUser(user){
    return this.http.post<any>(this._loginUrl, user);
  }
}
