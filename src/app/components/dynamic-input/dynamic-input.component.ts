import { Component, OnInit, Input } from '@angular/core';
import { FormInput } from "../../models/form-input";
import { HttpapiService } from "../../services/httpapi.service";
import { TableColumn,Columns} from "../../models/table";
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.css']
})
export class DynamicInputComponent implements OnInit {
  @Input() tipoInput: FormInput;
  @Input() mainTable: string;

  constructor() { }

  ngOnInit() {
  }


  onSubmit(valor:string){
    
    if(this.tipoInput.type=="reference") this.tipoInput.value=valor;
    console.log("Valor seleccionado:",valor);
//    console.log("CADENA:",this.tipoInput.value+" id=",this.tipoInput.id);

    if(this.tipoInput.value=="-----") {
      this.tipoInput.value="";
      this.tipoInput.type="search"
      this.tipoInput.options=[];
    }
    else{
      if(this.tipoInput.id!=""){
        let objeto : {}={};
        if(this.tipoInput.type=="search") objeto[this.tipoInput.column]=valor;
        else objeto[this.tipoInput.column]=this.tipoInput.value;


        console.log("GRABAR OBJETO:",objeto);
        //-----Graba el campo modificado a la DB
        // this.patch(this.mainTable,this.tipoInput.id,objeto)
        // .subscribe(
        //   result => {
        //     console.log("Grabado OK",result)
        //   },
        //   err => console.error("ERROR PATCH ",err),
        //   () => {} 
        // )
      }
    }
  }


}
