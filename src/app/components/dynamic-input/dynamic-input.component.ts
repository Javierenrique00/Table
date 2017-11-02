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

}
