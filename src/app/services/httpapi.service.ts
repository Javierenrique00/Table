import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import * as constants from '../config/constants';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { TableColumn, Columns } from "../models/table";

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

getSchemaTable(table: string): Observable<TableColumn[]>{
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

    var options = new RequestOptions({ headers: queryHeaders});

    return this.httpService
    .get(this.squemaUrl+table, options)
    .map((response) => {
        var result: any = response.json();
        let defColumn: Array < TableColumn > = [];
            result.field.forEach((field) => {
            var defCol=new TableColumn(field.name,field.label,field.type,0,"O","",field.ref_table,field.ref_field);
            defColumn.push(defCol);
         });

        return defColumn;
    }).catch(this.handleError);

  };

getDataTable(table: string,params ? :any): Observable<any>{
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

    var options = new RequestOptions({ headers: queryHeaders, params: params});

    return this.httpService
    .get(this.dataUrl+table, options)
    .map((response) => {
        var result: any = response.json();
        let filas: Array < Columns > = [];
        
            result.resource.forEach((cols) => {
            
            filas.push(cols);
         });

        return { data: filas, count: result.meta }
    }).catch(this.handleError);

};

remove(table: string, id: string):Observable<any> {
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    return this.httpService
        .delete(this.dataUrl+table + '/' + id, { headers: queryHeaders })
        .map((response) => {
            var result: any = response.json();
            return result.id;
        }).catch(this.handleError);
}


saveNew(table: string,objetoGrabar:any):Observable<any> {
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    let options = new RequestOptions({ headers: queryHeaders });

        //delete hero.id;
        return this.httpService.post(this.dataUrl + table, JSON.stringify({ resource: [objetoGrabar] }), options)
            .map((data) => {
                return data;
            }).catch(this.handleError);
    
  }

  patch(table: string,id: string,objetoGrabar:any):Observable<any>{
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

    var options = new RequestOptions({ headers: queryHeaders});

    return this.httpService.patch
    (this.dataUrl+table+"/"+id, JSON.stringify(objetoGrabar), options)
    .map((data) => {
        return data;
    }).catch(this.handleError);
}




  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg); // log to console instead
    localStorage.setItem('session_token', '');
    window.location.hash = '/login';
    return Observable.throw(errMsg);
  };


}
