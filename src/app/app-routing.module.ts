import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TableComponent } from './components/table/table.component';
import { LoginComponent } from './components/login/login.component';

const routes : Routes = [
    {path: "", redirectTo:"/login", pathMatch:"full"},
    {path: "login", component: LoginComponent},
    {path: "table", component: TableComponent}
]

@NgModule({
    imports: [ RouterModule.forRoot(routes)],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}