import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Product } from '../models/product';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();
  private loaded = false;

  constructor(private supabase: SupabaseService) {}

  private mapRow(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description || '',
      price: row.price,
      originalPrice: row.original_price,
      discount: row.discount,
      imageUrl: row.image_url,
      category: row.category,
      rating: row.rating,
      reviewCount: row.review_count,
      stock: row.stock,
      sold: row.sold,
      isFreeShipping: row.is_free_shipping,
      tags: row.tags || [],
      createdAt: new Date(row.created_at)
    };
  }

  getProducts(): Observable<Product[]> {
    if (!this.loaded) {
      this.loaded = true;
      from(this.supabase.getProducts()).pipe(
        map(rows => rows.map(r => this.mapRow(r))),
        tap(products => this.productsSubject.next(products))
      ).subscribe();
    }
    return this.products$;
  }

  getProductById(id: string): Observable<Product | undefined> {
    return from(this.supabase.getProductById(id)).pipe(
      map(row => row ? this.mapRow(row) : undefined)
    );
  }

  addProduct(product: Product): Observable<Product> {
    return from(this.supabase.addProduct(product)).pipe(
      map(row => this.mapRow(row)),
      tap(newProduct => {
        const products = this.productsSubject.value;
        this.productsSubject.next([...products, newProduct]);
      })
    );
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return from(this.supabase.updateProduct(id, product)).pipe(
      map(row => this.mapRow(row)),
      tap(updated => {
        const products = this.productsSubject.value;
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
          products[index] = updated;
          this.productsSubject.next([...products]);
        }
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return from(this.supabase.deleteProduct(id)).pipe(
      tap(() => {
        const products = this.productsSubject.value.filter(p => p.id !== id);
        this.productsSubject.next(products);
      })
    );
  }

  seedProducts(products: Product[]): Observable<void> {
    return from(this.supabase.seedProducts(products)).pipe(
      tap(() => this.loaded = false)
    );
  }
}
