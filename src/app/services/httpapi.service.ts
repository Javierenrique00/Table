import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import * as constants from '../config/constants';
import {Observable} from 'rxjs/Observable';

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


}
