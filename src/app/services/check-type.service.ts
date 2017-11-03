import { Injectable } from '@angular/core';

@Injectable()
export class CheckTypeService {

  constructor() { }

  checkValues(tipo,valor):boolean{
    //console.log("tipo",tipo);
    //console.log("valor",valor);
    if(valor=="") return false;
    if(valor=="-----") return false;
    if((tipo=="integer")&&(isNaN(valor))) return false;
    if((tipo=="float")&&(isNaN(valor))) return false;
    return true;
  }

}
