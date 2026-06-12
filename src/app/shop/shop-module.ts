import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShopRoutingModule } from './shop-routing-module';
import { HomeComponent } from './home/home';
import { ProductDetailComponent } from './product-detail/product-detail';
import { CartComponent } from './cart/cart';
import { ProductGridComponent } from './product-grid/product-grid';
import { LoadingComponent } from '../shared/loading/loading.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProductDetailComponent,
    CartComponent,
    ProductGridComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ShopRoutingModule
  ],
  providers: [
    DecimalPipe
  ]
})
export class ShopModule { }