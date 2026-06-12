import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
    (window as any).productService = this.productService;
  }

  editProduct(id: string) {
    this.router.navigate(['/admin/product/edit', id]);
  }

  deleteProduct(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe();
    }
  }

  getTotalValue(): number {
    return this.products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  }

  getTotalSold(): number {
    return this.products.reduce((sum, p) => sum + (p.sold || 0), 0);
  }

  getLowStock(): number {
    return this.products.filter(p => p.stock < 100).length;
  }
}