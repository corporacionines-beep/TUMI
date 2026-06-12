import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing-module';
import { DashboardComponent } from './dashboard/dashboard';
import { ProductsListComponent } from './products-list/products-list';
import { ProductFormComponent } from './product-form/product-form';
import { ImportProductsComponent } from './import-products/import-products';

@NgModule({
  declarations: [
    DashboardComponent,
    ProductsListComponent,
    ProductFormComponent,
    ImportProductsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }