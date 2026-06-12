import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  async getProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Product[];
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Product;
  }

  async addProduct(product: Product): Promise<Product> {
    const { data, error } = await this.supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice,
        discount: product.discount,
        image_url: product.imageUrl,
        category: product.category,
        rating: product.rating,
        review_count: product.reviewCount,
        stock: product.stock,
        sold: product.sold,
        is_free_shipping: product.isFreeShipping,
        tags: product.tags,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await this.supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.originalPrice,
        discount: product.discount,
        image_url: product.imageUrl,
        category: product.category,
        rating: product.rating,
        review_count: product.reviewCount,
        stock: product.stock,
        sold: product.sold,
        is_free_shipping: product.isFreeShipping,
        tags: product.tags
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async seedProducts(products: Product[]): Promise<void> {
    const inserts = products.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price,
      original_price: p.originalPrice,
      discount: p.discount,
      image_url: p.imageUrl,
      category: p.category,
      rating: p.rating,
      review_count: p.reviewCount,
      stock: p.stock,
      sold: p.sold,
      is_free_shipping: p.isFreeShipping,
      tags: p.tags,
      created_at: new Date().toISOString()
    }));

    const { error } = await this.supabase.from('products').insert(inserts);
    if (error) throw error;
  }
}
