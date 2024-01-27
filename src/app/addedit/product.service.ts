import { Injectable } from '@angular/core';
import { Product } from './product';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] =[];
  private apiUrl = 'https://pruebafractal-red-pine-9084.fly.dev';//'assets/products.json';
  //private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  getProductos(): Observable<Product[]> {

    return this.http.get<any>(`${this.apiUrl}/api/products`);

    //return this.http.get<Product[]>(this.productsUrl);
  }
  /*getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }*/
}

