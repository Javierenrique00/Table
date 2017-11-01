import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import * as constants from '../config/constants';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpapiService {
//  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/hero';
  squemaUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_schema/';
  dataUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/';


  constructor(private httpService:Http) { }

  newSession(email:string,pwd:string):Observable<any>{
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: queryHeaders });
    return this.httpService.post(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/user/session', JSON.stringify({email:email,password:pwd}), options);
  }

  getTables(): Observable<any>{
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

    var options = new RequestOptions({ headers: queryHeaders});

    return this.httpService
    .get(this.dataUrl, options)
    .map((response) => {
        var result: any = response.json();
        return result.resource;
    }).catch(this.handleError);

};



  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg); // log to console instead
    localStorage.setItem('session_token', '');
    window.location.hash = '/login';
    return Observable.throw(errMsg);
  };


}
