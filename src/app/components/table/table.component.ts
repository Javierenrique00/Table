import { Component, OnInit } from '@angular/core';
import { HttpapiService } from "../../services/httpapi.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  tablesOptions:any[]=[];
  mainTable: string="";

  constructor(
    private httpService: HttpapiService
  ) { }

  ngOnInit() {
    this.loadTables();
  }

  loadTables(){
    this.tablesOptions=[];
    this.tablesOptions.push({key:"", value:"Select table..."});
    this.httpService.getTables().subscribe(
      tab => tab.forEach(dat =>
            this.tablesOptions.push({key:dat.name, value:dat.name})                  )
    )
  }

  onSelectTable(table:string){
    this.mainTable=table;
    //this.getTable(this.mainTable);
    console.log("TABLA:",this.mainTable);
   
  }


}
