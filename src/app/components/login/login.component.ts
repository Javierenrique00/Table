import { Component, OnInit } from '@angular/core';
import { HttpapiService } from "../../services/httpapi.service"
import { FormsModule }   from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email="";
  pwd="";


  constructor(
    private httpService:HttpapiService,
    private _router: Router
  ) { }

  ngOnInit() {
  }

  private storeToken(data) {
    localStorage.setItem('session_token', data.session_token);
    this._router.navigate(['table']);
  }

  onButton() :void{

    //--Crea la seasión
    this.httpService.newSession(this.email,this.pwd).subscribe(
      data=> this.storeToken(data.json()),
      error=> console.error("Error")
    )


  }


}
