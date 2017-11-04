import { Component, OnInit, Input } from '@angular/core';
import { FormInput } from "../../models/form-input";
import { HttpapiService } from "../../services/httpapi.service";
import { CheckTypeService } from "../../services/check-type.service";
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

  searchObservable:Observable<string>;
  searchObserver:Observer<string>;

  constructor(
    private httpService: HttpapiService,
    private CheckType: CheckTypeService,
  ) { }

  ngOnInit() {
    if(this.tipoInput.type=="reference"){
      //-- Crea el observable que maneja la entrada del campo input
      this.searchObservable=new Observable(
        (observer:Observer<string>)=>{
          this.searchObserver=observer;
        });
        //-- crea el observable defTable

        this.httpService.getSchemaTable(this.tipoInput.refTable).subscribe(
          (defTable) =>{
            this.searchObservable.debounceTime(300).distinctUntilChanged().map(
              (valor) => this.buildParam(valor,defTable)
            ).subscribe(
              param=>{
                this.httpService.getDataTable(this.tipoInput.refTable,param).subscribe(
                  dat =>{
                    let dato:any[]=dat.data;
                    //console.log("FILTER_DATA ",dat.data);
                    let options: any[]=[];
                    options.push({key:"-----",value:"Select..."});
                    dato.forEach(
                      row=>{
                        let opcion="";
                        Object.keys(row).forEach(elem=> opcion+= row[elem]+";"); //-- Recorre todas las llaves del objeto
                        options.push({key:row[this.tipoInput.refField], value:(opcion.slice(0,30))});
                      })
                    this.tipoInput.options=options;
                  },
                  (err)=> console.error("Error ",err)
                )
              }
            )
        
          },
          (err)=> console.error("Error ",err)
        );

      }

  }


  onSubmit(valor:string){
    
    if(this.tipoInput.type=="reference") this.tipoInput.value=valor;
    //console.log("Valor seleccionado:",valor);
//    console.log("CADENA:",this.tipoInput.value+" id=",this.tipoInput.id);

    if(this.tipoInput.value=="-----") {
      this.tipoInput.value="";
      this.tipoInput.type="search"
      this.tipoInput.options=[];
    }
    else{
        let objeto : {}={};
        if(this.tipoInput.type=="search") { 
          objeto[this.tipoInput.column]=valor;
          this.tipoInput.value=valor
          //console.log("tipo search - valor",valor);
        }
        else objeto[this.tipoInput.column]=this.tipoInput.value;

      if(this.tipoInput.id!=""){
        //console.log("GRABAR OBJETO:",objeto);
        if(this.CheckType.checkValues(this.tipoInput.type,this.tipoInput.value)) this.httpService.patch(this.mainTable,this.tipoInput.id,objeto)
        .subscribe(
          result => {
            //console.log("Grabado OK",result)
          },
          err => console.error("ERROR PATCH ",err),
          () => {} 
        )
        else console.log("Error al ingresar datos - No grabado")
      }
    }
  }


  buildParam(search:string,defTable:TableColumn[]):{} {
    var param = {};
    param["limit"]=100;
    param["include_count"]="true";
    let filterLine="";
    //--detecta si el valor puede convertirse numericamemente para hacerlo con el id
    if( isNaN(parseInt(search))){
      //-- no es numero
      defTable.forEach(col=>
        {
          if(col.type=="string") filterLine+="("+col.name+" LIKE "+"\"%"+search +"%\") OR ";
        })
        filterLine = filterLine.slice(0,filterLine.length-4); //--Le quita el ultimo OR
    }
    else{
      //-- Es numero
        defTable.forEach(col=>
        {
          if(col.type=="id") filterLine+=col.name+"="+search;
        }) 
    }
    param["filter"]=filterLine;
    //console.log("param: ",filterLine);
    return param;
  }



  onSearch(busqueda:string){
    this.searchObserver.next(busqueda);
  }


}
