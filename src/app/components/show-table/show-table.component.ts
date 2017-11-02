import { Component, OnInit, Input } from '@angular/core';
import { HttpapiService } from "../../services/httpapi.service";
import { TableColumn,ParamTable } from "../../models/table";
import { FormInput } from "../../models/form-input"
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'app-show-table',
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.css']
})
export class ShowTableComponent implements OnInit {
  @Input() mainTable:string;
  defTable : TableColumn[]=[];
  param: ParamTable;
  controlTable : FormInput[][]=[];
  totalRegistros: number = 0;

  constructor(
    private httpService: HttpapiService
  ) { }

  ngOnInit() {
    this.param=new ParamTable(10,0,true,"","",this.defTable);
  }

  ngOnChanges() {
    if(this.mainTable!="") this.getTable(this.mainTable);
  }

  getTable(tabla:string){

    this.defTable=[];
    this.httpService.getSchemaTable(tabla).subscribe(
      result => {
        this.defTable = result; //-- Carga la definición de la tabla, todas sus columnas.

        this.update_ControlTable();



        //loadAllReferenceData----


        //this.initNewRegister(); //-- Crea el observable

        //---- se suscribe al observable
        // this.refObservable.subscribe(
        //   (data)=>{
        //     //-- Guarda el dato en el cache refData            
        //     this.refdata[Object.keys(data)[0]]=data[Object.keys(data)[0]];            
        //     this.refAct+=1;
        //     if(this.refAct==this.refMax) this.refObserver.complete();
        //   },
        //   (err)=> console.error("ERROR Observable ",err),
        //   ()=>{
        //     this.endLoadData();
        //   }
        // );

      })
  }

  update_ControlTable(){
    this.getData(this.mainTable,this.param.paramReturn(),this.defTable)
    .subscribe(
      data =>this.controlTable=data
    );
  }


  getData(tabla:string,param:any,defTable:TableColumn[]):Observable<FormInput[][]>{

    return this.httpService.getDataTable(tabla,param).map(
      result => {
          let controlTable : FormInput[][]=[];

          this.totalRegistros = result.count.count;
          let i=0;
          result.data.forEach(
            objeto =>{

              let j=0;
              let controlColumns : FormInput[]=[];
              defTable.forEach( (rec)=>{
                  //---- cheque que dentro de las opciones se encuentre el valor de llave
                  //---- para que si no está se ingresa directamente 
                  // if(rec.type=="reference" && !this.checkKey(this.refdata[rec.name],objeto[rec.name]))
                  //   this.refdata[rec.name].push({key: objeto[rec.name].toString(), value: objeto[rec.name]});
    
                  controlColumns.push( new FormInput(
                  objeto["id"].toString(),  //-id
                  rec.type,                 //-type
                  "nom"+i.toString()+j.toString(),  //-Nombre del control
                  objeto[rec.name].toString(), // Valor eval("objeto."+rec.name).toString(), //--> se puede reemplazar por objeto[rec.name].toString()
                  rec.name,
                  true, //---Disable en true
                  [],  //this.refdata[rec.name], //options
                  rec.refTable,
                  rec.refField,
                  objeto[rec.name].toString()  //Search field
                )); //----Trae los datos del cache de referencia
                j=j+1;
              });
              controlTable.push(controlColumns);
              i=i+1;
            }
          )
          return controlTable;
      })


  }


  onFilter(){
    this.update_ControlTable();
  }

  onOrder(columna:string){
    this.defTable.forEach(
      col =>{
        if(col.name==columna){
          col.order=col.order+1;
          if(col.order>2) col.order=0;
          if(col.order==0) {col.simboloOrder="O";col.paramOrder=""}
          if(col.order==1) {col.simboloOrder="ASC";col.paramOrder=columna+" asc "}
          if(col.order==2) {col.simboloOrder="DES";col.paramOrder=columna+" desc "}
        }
      });
      this.param.defTable=this.defTable;
      this.update_ControlTable();
  }


  onNext(){
    this.param.offset+=this.param.limit;
    this.update_ControlTable();
  }

  onPrev(){
    this.param.offset-=this.param.limit;
    if(this.param.offset<0) this.param.offset=0;
    this.update_ControlTable();

  }

  onFirst(){
    this.param.offset=0;
    this.update_ControlTable();
  }

  onLast(){
    this.param.offset=this.totalRegistros-this.param.limit+1;
    if(this.param.offset<0) this.param.offset=0;
    this.update_ControlTable();
  }



}
