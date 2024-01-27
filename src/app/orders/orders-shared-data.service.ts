import { Injectable } from '@angular/core';
import { Order } from './order';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersSharedDataService {

  private apiUrl = 'https://pruebafractal-red-pine-9084.fly.dev';
  //private apiUrl = 'http://localhost:8080';
  private orders: Order[] = [];

  order: Order = new Order();
  dataItem:any;
  editingOrder: { order: Order, index: number };
  editingOrderIndex: number = -1;
  creatingNewOrder: boolean = false;

  constructor(private http: HttpClient) { }

  getOrders(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/orders`);
  }

  getOrderDetails(orderId: number):Observable<any>{
    console.log(orderId);
    return this.http.get<any>(`${this.apiUrl}/api/item-orders/${orderId}`);
  }


  deleteOrder(numOrder: number): void{

    this.http.delete(`${this.apiUrl}/api/orders/delete/${numOrder}`).subscribe(
      (response) => {
        console.log('Respuesta exitosa:', response);
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          console.error('Status:', error.status);
          console.error('Body:', error.error);
            console.error('Error en la solicitud:', error);
          }
      }
    );
  }

  deleteItemsOrder(numOrder: number): void{
    this.http.delete(`${this.apiUrl}/api/item-orders/delete/${numOrder}`).subscribe(
      (response) => {
        console.log('Respuesta exitosa:', response);
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          console.error('Status:', error.status);
          console.error('Body:', error.error);
            console.error('Error en la solicitud:', error);
          }
      }
    );
  }

  putOrder(body: any): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    console.log(body);
    this.http.put(`${this.apiUrl}/api/orders/save`, body,httpOptions).subscribe(
      (response) => {
        // Manejar la respuesta exitosa aquí
        console.log('Respuesta exitosa:', response);
      },
      (error) => {
        // Manejar el error aquí

      if (error instanceof HttpErrorResponse) {
        console.error('Status:', error.status);
        console.error('Body:', error.error);
          console.error('Error en la solicitud:', error);
        }
      }
    );
  }


  updateOrder(body:any):void{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    console.log(body);
    this.http.put(`${this.apiUrl}/api/orders/update`, body,httpOptions).subscribe(
      (response) => {
        // Manejar la respuesta exitosa aquí
        console.log('Respuesta exitosa:', response);
      },
      (error) => {
        // Manejar el error aquí
        if (error instanceof HttpErrorResponse) {
          console.error('Status:', error.status);
          console.error('Body:', error.error);
            console.error('Error en la solicitud:', error);
          }
      }
    );
  }

  updateItemsOrder(body:any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    console.log(body);
    this.http.put(`${this.apiUrl}/api/item-orders/update`, body,httpOptions).subscribe(
      (response) => {
        console.log('Respuesta exitosa:', response);
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          console.error('Status:', error.status);
          console.error('Body:', error.error);
            console.error('Error en la solicitud:', error);
          }
      }
    );
  }

  // Nuevo método para establecer el item y el índice de edición
  setEditingOrder(order: Order, index: number): void {
    this.editingOrder = { order, index };
  }

  getEditingOrder(): Order {//{ itemOrder: ItemOrder, index: number } {
    return this.editingOrder.order;
  }

  clearEditingItem(): void {
    this.editingOrder = null;
    this.editingOrderIndex = -1;
  }

  getAllProducts(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  setCreatingNewOrder(value: boolean) {
    this.creatingNewOrder = value;
  }

  isCreatingNewOrder(): boolean {
    return this.creatingNewOrder;
  }

}
