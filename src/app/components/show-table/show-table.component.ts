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
  refData: {}={}; //--son los registros indexados por llave del nombre "Referenciado" en la tabla principal ej: refData["color"][id]={key:3 data:"3-rojo;"}
  newRegistro : FormInput[]=[];

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

      })
  }

  update_ControlTable(){
    this.getData(this.mainTable,this.param.paramReturn(),this.defTable)
    .subscribe(
      data =>{
        this.controlTable=data;
        this.loadReferenceData(this.controlTable,this.defTable);
      }
    );
  }


  loadReferenceData(controlTable:FormInput[][],defTable : TableColumn[]){
    let refMax=0;
    let refAct=0;
    let search:string[]=[];
    let colName:string[]=[];
    let refField:string[]=[];
    let refTableName:string[]=[];
    controlTable.forEach( //--Saca todas las referencias que hay que buscar
      row => {
        row.forEach(
          col =>{
            if(col.type=="reference"){
              let indice=this.checkColName(col.column,colName);
              if(indice!=-1){
                search[indice]+="("+col.refField+"="+col.value+") OR ";
              }
              else {
                colName.push(col.column);
                search.push("("+col.refField+"="+col.value+") OR ");
                refTableName.push(col.refTable);
                refField.push(col.refField);
              }
            }
          }
        )

      })
      //--trae los datos de referencia
      search.forEach(
        (dat,indice)=>{
          
          let param={};
          param["limit"]="50";
          param["include_count"]="true";
          param["filter"]=dat.slice(0,dat.length-4); //--- Borra el ultimo OR  
          //console.log("Table:",tableName[indice]+" filter="+ JSON.stringify(param) );  
          //console.log("Launch Indice", indice+" "+this.refTableName[indice]);               
          this.httpService.getDataTable(refTableName[indice],param).subscribe(
            res=>{
              let datos= res.data; 
              let options: any[]=[];
              options.push({key: "", value: "Choose Value"});
              datos.forEach(
                row=>{
                  let opcion="";
                  Object.keys(row).forEach(elem=> opcion+= row[elem]+";");
                  options.push({key: row[refField[indice]], value: opcion.slice(0,30)});
                })
                
                options.push({key: "-----", value: "More values..."});
                this.refData[colName[indice]]=options;
                            
              //console.log("refData",this.refData);

              //----pone los campos de options para seleccionar
              controlTable.forEach( 
                fila => {
                  fila.forEach(
                    columna =>{
                      if(columna.type=="reference"){
                        columna.options=this.refData[columna.column];
                      }
                    });
                  });
                  this.newRegistro=[];
                  this.initNewRegister();
            })
        });

        this.newRegistro=[];
        this.initNewRegister();

  }

  //--devuelve el indice del nombre, si el nombre no está devuelve -1
  checkColName(name,colName:string[]):number{
    let indice=0;
    let longitud=colName.length;
    if(longitud!=0){
      while(colName[indice]!=name && indice<longitud){
        indice+=1;
      }
      if(indice==longitud) return -1;
      return indice;
    }
    else return -1;
  }

  initNewRegister(){
    this.newRegistro=[];
    this.defTable.forEach(
      (field)=>{
        
        let options: any[]=[];
        if(field.type=="reference"){
          //-- debe cargar las referencias posibles
          options=this.refData[field.name];
        }
          this.newRegistro.push( new FormInput(
            "",           //-id
            field.type,   //-tipo
            "new",        //-name
            "",           //-value
            field.name,   //-column
            false,        //-disabled
            options,       //-options -> seleccion multiple
            field.refTable,
            field.refField,
            " " //-Debe dejar un campo diferente de "" para que inicialize el observable de busqueda
          ));
      });
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


  onEditRow(i:string){
    this.controlTable[i].forEach(
      (control) =>{
        control.disabled=!control.disabled;
      }
    );
  }

onDelete(i:string){
    //console.log("BORRANDO ",this.controlTable[i][0].id);
    this.httpService.remove(this.mainTable,this.controlTable[i][0].id).subscribe(
      result => this.update_ControlTable()
    )

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

  onNew(){
      //--- Graba los datos de un nuevo registro
      let errorSave=false;
      let objeto : {}={};
      this.newRegistro.forEach(
        (obj)=>{
          if(obj.column!="id") {
            objeto[obj.column]=obj.value;
            if(!this.checkValues(obj.type,obj.value)) errorSave=true ;
          }

        });
      //console.log("Grabando Nuevo ",objeto);
      //console.log("NewRegistro ",this.newRegistro);
    
      if(!errorSave){
        this.httpService.saveNew(this.mainTable,objeto).subscribe(
          result => this.update_ControlTable() ,
          err => console.error("Error grabando nuevo ",err))
      }
      else{
        console.log("Error varificando valores para grabar.");
      }


    }
  
    checkValues(tipo,valor):boolean{
      if(valor=="") return false
      if(valor=="-----") return false
    

      return true;
    }





}
