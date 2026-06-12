import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-import-products',
  templateUrl: './import-products.html',
  styleUrls: ['./import-products.css'],
  standalone: false
})
export class ImportProductsComponent {
  loading = false;
  result: { success: number; errors: string[] } | null = null;
  preview: any[] | null = null;

  constructor(
    private productService: ProductService,
    public router: Router
  ) {}

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.loading = true;
    this.result = null;
    this.preview = null;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        this.preview = rows.slice(0, 5);
        this.processProducts(rows).catch(() => {
          this.result = { success: 0, errors: ['Error al procesar los productos'] };
          this.loading = false;
        });
      } catch (err) {
        this.result = { success: 0, errors: ['Error al leer el archivo. Verifica que sea un Excel válido.'] };
        this.loading = false;
      }
    };
    reader.readAsArrayBuffer(file);
  }

  private async processProducts(rows: any[]) {
    const errors: string[] = [];
    let success = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;

      if (!row.nombre || !row.precio || !row.stock || !row.categoria || !row.imagen) {
        errors.push(`Fila ${rowNum}: faltan campos obligatorios (nombre, precio, stock, categoria, imagen)`);
        continue;
      }

      const price = Number(row.precio);
      const originalPrice = row.precio_original ? Number(row.precio_original) : undefined;
      const stock = Number(row.stock);

      if (isNaN(price) || price <= 0) {
        errors.push(`Fila ${rowNum}: precio inválido`);
        continue;
      }
      if (isNaN(stock) || stock < 0) {
        errors.push(`Fila ${rowNum}: stock inválido`);
        continue;
      }

      const product: Product = {
        id: '',
        name: String(row.nombre).trim(),
        description: String(row.descripcion || '').trim(),
        price: price,
        originalPrice: originalPrice,
        discount: originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
        imageUrl: String(row.imagen).trim(),
        category: String(row.categoria).trim(),
        rating: row.rating ? Number(row.rating) : 4.5,
        reviewCount: row.reviews ? Number(row.reviews) : 0,
        stock: stock,
        sold: row.vendidos ? Number(row.vendidos) : 0,
        isFreeShipping: row.envio_gratis === 'Si' || row.envio_gratis === 'si' || row.envio_gratis === 'Sí' || row.envio_gratis === 'sí' || row.envio_gratis === true,
        tags: row.tags ? String(row.tags).split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        createdAt: new Date()
      };

      try {
        await lastValueFrom(this.productService.addProduct(product));
        success++;
      } catch {
        errors.push(`Fila ${rowNum}: error al guardar`);
      }
    }

    this.result = { success, errors };
    this.loading = false;
  }

  downloadTemplate() {
    const wb = XLSX.utils.book_new();
    const data = [
      {
        nombre: 'Audífonos Bluetooth',
        descripcion: 'Audífonos inalámbricos con cancelación de ruido',
        precio: 25.99,
        precio_original: 89.99,
        stock: 500,
        categoria: 'Electrónicos',
        imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        rating: 4.5,
        reviews: 15000,
        vendidos: 25000,
        envio_gratis: 'Si',
        tags: 'Popular,Oferta'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'plantilla_productos.xlsx');
  }
}
