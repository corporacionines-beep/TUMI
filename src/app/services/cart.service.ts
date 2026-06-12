import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('cart');
      if (stored) {
        this.cartItemsSubject.next(JSON.parse(stored));
      }
    }
  }

  private saveCart() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
    }
  }

  addToCart(product: Product, quantity: number = 1) {
    const items = this.cartItemsSubject.value;
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }

    this.cartItemsSubject.next([...items]);
    this.saveCart();
  }

  removeFromCart(productId: string) {
    const items = this.cartItemsSubject.value.filter(
      item => item.product.id !== productId
    );
    this.cartItemsSubject.next(items);
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number) {
    const items = this.cartItemsSubject.value;
    const item = items.find(i => i.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartItemsSubject.next([...items]);
        this.saveCart();
      }
    }
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    this.saveCart();
  }

  getTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  getItemCount(): number {
    return this.cartItemsSubject.value.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }
}