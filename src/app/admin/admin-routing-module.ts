import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { ProductFormComponent } from './product-form/product-form';
import { ImportProductsComponent } from './import-products/import-products';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'product/new', component: ProductFormComponent },
  { path: 'product/edit/:id', component: ProductFormComponent },
  { path: 'product/import', component: ImportProductsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }