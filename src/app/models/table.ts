export class TableColumn {
    constructor (
        public name:string,
        public label:string,
        public type:string,
        public order:number,            // 0 sin orden,  1 asc,  2 desc
        public simboloOrder:string,     // Es el string que muestra
        public paramOrder:string,       // Es el parametro que usa
        public refTable:string,         //   "ref_table": Reference table
        public refField:string          //  "ref_field":  Reference field column
    ){}
}

export class Columns {
    constructor(
        public columns:any[],
    ){}
}

export class ParamTable{
param = {};
    constructor(
        public limit:number,
        public offset:number,
        public include_count:boolean,
        public order:string,
        public filter:string,
        public defTable:TableColumn[]
    ){
        this.paramUpdate();
    }


    private paramUpdate(){
        this.param["limit"]=this.limit;
        this.param["offset"]=this.offset;
        this.param["include_count"]=this.include_count;
        this.param["order"]=this.getParamOrder(this.defTable);
        this.param["filter"]=this.filter;
    }

    private getParamOrder(defTable:TableColumn[]):string {
        let salida="";
        defTable.forEach(
          col =>{
          salida = salida + col.paramOrder;
          });
        return salida;
      }

    paramReturn():any{
        this.paramUpdate();
        return this.param;
    }


}