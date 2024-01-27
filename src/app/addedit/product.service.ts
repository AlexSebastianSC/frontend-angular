import { Injectable } from '@angular/core';
import { Product } from './product';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] =[];
  private apiUrl = 'https://pruebafractal-red-pine-9084.fly.dev';

  constructor(private http: HttpClient) {
  }

  getProductos(): Observable<Product[]> {
    return this.http.get<any>(`${this.apiUrl}/api/products`);
  }

}

