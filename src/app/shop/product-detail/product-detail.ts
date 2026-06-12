import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadProduct(params['id']);
      }
    });
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe(product => {
      this.product = product || null;
      if (this.product) {
        this.productService.getProducts().subscribe(products => {
          this.relatedProducts = products
            .filter(p => p.category === this.product?.category && p.id !== this.product?.id)
            .slice(0, 4);
        });
      }
    });
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      //alert(`¡${this.quantity} producto(s) agregado(s) al carrito!`);
    }
  }

  goBack() {
    this.router.navigate(['/shop/home']);
  }

  goToCart() {
    this.router.navigate(['/shop/cart']);
  }
}