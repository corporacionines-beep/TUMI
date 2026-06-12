export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  images?: string[];
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  sold?: number;
  tags?: string[];
  isFreeShipping: boolean;
  createdAt: Date;
}