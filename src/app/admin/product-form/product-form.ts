import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],
  standalone: false
})
export class ProductFormComponent implements OnInit {
  isEditing = false;
  productId: string | null = null;
  loading = false;

  productForm = {
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    category: '',
    rating: 4.5,
    reviewCount: 0,
    imageUrl: '',
    tags: [] as string[],
    isFreeShipping: true
  };

  categories = ['Electrónicos', 'Accesorios', 'Gaming', 'Hogar', 'Deportes', 'Audio'];
  availableTags = ['Popular', 'Nuevo', 'Oferta', 'Gaming', 'Premium'];

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.productId = params['id'];
        this.loadProduct(params['id']);
      }
    });
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe(product => {
      if (product) {
        this.productForm = {
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice || 0,
          stock: product.stock,
          category: product.category,
          rating: product.rating,
          reviewCount: product.reviewCount,
          imageUrl: product.imageUrl,
          tags: product.tags || [],
          isFreeShipping: product.isFreeShipping
        };
      }
    });
  }

  toggleTag(tag: string) {
    const index = this.productForm.tags.indexOf(tag);
    if (index > -1) {
      this.productForm.tags.splice(index, 1);
    } else {
      this.productForm.tags.push(tag);
    }
  }

  isTagSelected(tag: string): boolean {
    return this.productForm.tags.includes(tag);
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  saveProduct() {
    if (!this.productForm.name || !this.productForm.price || !this.productForm.stock || !this.productForm.category || !this.productForm.imageUrl) {
      this.notificationService.error('Por favor completa todos los campos obligatorios (*)');
      return;
    }

    this.loading = true;

    const discount = this.productForm.originalPrice > 0
      ? Math.round(((this.productForm.originalPrice - this.productForm.price) / this.productForm.originalPrice) * 100)
      : 0;

    const product: Product = {
      id: this.productId || '',
      name: this.productForm.name,
      description: this.productForm.description,
      price: this.productForm.price,
      originalPrice: this.productForm.originalPrice || undefined,
      discount: discount || undefined,
      imageUrl: this.productForm.imageUrl,
      category: this.productForm.category,
      rating: this.productForm.rating,
      reviewCount: this.productForm.reviewCount,
      stock: this.productForm.stock,
      tags: this.productForm.tags,
      isFreeShipping: this.productForm.isFreeShipping,
      createdAt: new Date()
    };

    const request = this.isEditing && this.productId
      ? this.productService.updateProduct(this.productId, product)
      : this.productService.addProduct(product);

    request.subscribe({
      next: () => {
        this.notificationService.success(this.isEditing ? '✓ Producto actualizado exitosamente' : '✓ Producto creado exitosamente');
        this.loading = false;
        setTimeout(() => this.router.navigate(['/admin/dashboard']), 1000);
      },
      error: () => {
        this.notificationService.error('Error al guardar el producto');
        this.loading = false;
      }
    });
  }
}