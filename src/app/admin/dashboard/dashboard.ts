import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  seeding = false;

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService,
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

  seedProducts() {
    this.seeding = true;
    const products: Product[] = [
      {
        id: '', name: 'Audífonos Inalámbricos Bluetooth 5.0',
        description: 'Audífonos con cancelación de ruido, sonido premium y batería de larga duración.',
        price: 25.99, originalPrice: 89.99, discount: 71,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: 'Electrónicos', rating: 4.6, reviewCount: 15420, stock: 500, sold: 25341,
        isFreeShipping: true, tags: ['Popular'], createdAt: new Date()
      },
      {
        id: '', name: 'Reloj Inteligente Deportivo',
        description: 'Smartwatch con monitor cardíaco, podómetro y resistencia al agua IP68.',
        price: 39.99, originalPrice: 129.99, discount: 69,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        category: 'Electrónicos', rating: 4.4, reviewCount: 8730, stock: 300, sold: 12450,
        isFreeShipping: true, tags: ['Popular', 'Oferta'], createdAt: new Date()
      },
      {
        id: '', name: 'Mochila Impermeable para Laptop 15.6"',
        description: 'Mochila resistente al agua con múltiples compartimentos, ideal para viajes.',
        price: 32.50, originalPrice: 79.99, discount: 59,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        category: 'Accesorios', rating: 4.7, reviewCount: 6200, stock: 200, sold: 8930,
        isFreeShipping: true, tags: ['Popular'], createdAt: new Date()
      },
      {
        id: '', name: 'Teclado Mecánico RGB Inalámbrico',
        description: 'Teclado mecánico con retroiluminación RGB, switches Cherry MX y Bluetooth 5.1.',
        price: 45.99, originalPrice: 99.99, discount: 54,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
        category: 'Gaming', rating: 4.8, reviewCount: 3450, stock: 150, sold: 5670,
        isFreeShipping: true, tags: ['Gaming', 'Popular'], createdAt: new Date()
      },
      {
        id: '', name: 'Lámpara LED Inteligente WiFi',
        description: 'Lámpara LED compatible con Alexa y Google Home, millones de colores.',
        price: 18.99, originalPrice: 49.99, discount: 62,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        category: 'Hogar', rating: 4.3, reviewCount: 12000, stock: 400, sold: 21300,
        isFreeShipping: false, tags: ['Nuevo', 'Oferta'], createdAt: new Date()
      },
      {
        id: '', name: 'Parlante Bluetooth Portátil 30W',
        description: 'Parlante inalámbrico con sonido estéreo 360° y batería de 12 horas.',
        price: 22.99, originalPrice: 69.99, discount: 67,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
        category: 'Audio', rating: 4.5, reviewCount: 9800, stock: 350, sold: 18700,
        isFreeShipping: true, tags: ['Popular', 'Oferta'], createdAt: new Date()
      }
    ];
    this.productService.seedProducts(products).subscribe({
      next: () => {
        this.notificationService.success('✓ 6 productos de ejemplo cargados');
        this.seeding = false;
      },
      error: () => {
        this.notificationService.error('Error al cargar productos');
        this.seeding = false;
      }
    });
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