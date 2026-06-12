import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cartCount: number = 0;
  cartOpen: boolean = false;
  cartItems: CartItem[] = [];
  loading: boolean = false;
  mobileMenuOpen: boolean = false;
  favoriteIds: Set<string> = new Set();

  // Filtros
  searchQuery: string = '';
  selectedCategory: string = 'all';
  selectedPriceRange: string = 'all';
  sortBy: string = 'featured';

  categories: string[] = ['Electrónicos', 'Accesorios', 'Gaming', 'Hogar', 'Deportes', 'Audio'];

  priceRanges = [
    { label: 'Todos los precios', value: 'all' },
    { label: 'Menos de $20', value: '0-20' },
    { label: '$20 - $50', value: '20-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: 'Más de $100', value: '100-999999' }
  ];

  sortOptions = [
    { label: 'Destacados', value: 'featured' },
    { label: 'Precio: Menor a Mayor', value: 'price-asc' },
    { label: 'Precio: Mayor a Menor', value: 'price-desc' },
    { label: 'Más Vendidos', value: 'popular' },
    { label: 'Mejor Calificados', value: 'rating' }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.applyFilters();
      this.loading = false;
    });

    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.cartCount = this.cartService.getItemCount();
    });
  }

  applyFilters() {
    let result = [...this.products];

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    if (this.selectedCategory !== 'all') {
      result = result.filter(p => p.category === this.selectedCategory);
    }

    if (this.selectedPriceRange !== 'all') {
      const [min, max] = this.selectedPriceRange.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    switch (this.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    this.filteredProducts = result;
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
    this.mobileMenuOpen = false; // Cerrar menú móvil al seleccionar
  }

  onPriceRangeChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedPriceRange = 'all';
    this.sortBy = 'featured';
    this.applyFilters();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.cartOpen = true;
    //this.notificationService.success(`${product.name} agregado al carrito`);
  }

  viewProduct(id: string) {
    this.router.navigate(['/shop/product', id]);
  }

  toggleFavorite(id: string) {
    if (this.favoriteIds.has(id)) {
      this.favoriteIds.delete(id);
    } else {
      this.favoriteIds.add(id);
    }
  }

  buyNow(product: Product) {
    this.cartService.addToCart(product);
    this.router.navigate(['/shop/home'], { queryParams: { cart: 'open' } });
    setTimeout(() => this.cartOpen = true, 100);
  }

  toggleCart() {
    this.cartOpen = !this.cartOpen;
  }

  closeCart() {
    this.cartOpen = false;
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
    this.notificationService.info('Producto eliminado del carrito');
  }

  updateQuantity(productId: string, change: number) {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        this.cartService.updateQuantity(productId, newQuantity);
      }
    }
  }

  get cartTotal(): number {
    return this.cartService.getTotal();
  }
}