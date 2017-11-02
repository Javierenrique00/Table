export class FormInput {    
    
    constructor(
        public id:string, //-- para guardar el ID de la fila de la tabla para modificar el campo
        public type:string,
        public name:string,
        public value:string,
        public column:string,
        public disabled:boolean,
        public options:{key: string, value: string}[],
        public refTable:string,         
        public refField:string,
        public searchField:string,

    ){}

}