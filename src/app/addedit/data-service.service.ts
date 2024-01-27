import { Injectable } from '@angular/core';
import { ItemOrder } from './itemOrder';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Expansion } from '@angular/compiler';
import { Order } from '../orders/order';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private itemsUrl = "https://pruebafractal-red-pine-9084.fly.dev";
  //private itemsUrl = 'http://localhost:8080';
  private itemsSubject = new BehaviorSubject<ItemOrder[]>([]);
  items$ = this.itemsSubject.asObservable();

  private itemOrderSubject = new BehaviorSubject<ItemOrder | null>(null);
  itemOrder$ = this.itemOrderSubject.asObservable();

  private orderSubject = new BehaviorSubject<Order | null>(null);
  order$ = this.orderSubject.asObservable();

  private selectedProductSubject = new BehaviorSubject< ItemOrder |null>(null);
  product$ = this.selectedProductSubject.asObservable();

  private createdMode = new BehaviorSubject<boolean|null>(null);
  createdMode$ = this.createdMode.asObservable();

  constructor(private http:HttpClient) { }

  //Getting colections of objects through HTTP
  fetchItems(orderId: number): Observable<ItemOrder[]>{
    return this.http.get<ItemOrder[]>(`${this.itemsUrl}/api/item-orders/${orderId}`)
    .pipe(
      tap(items => console.log('Items recibidos:', items))
    );
  }

  getItems(): Observable<ItemOrder[]> {
    return this.itemsSubject.asObservable();
  }

  setCreatedMode(state: boolean){
    this.createdMode.next(state)
  }

  getCreatedMode(): boolean | null{
    return this.createdMode.value;
  }

  //Set collection of objects on service
  setItems(items: ItemOrder[]):void{
      this.itemsSubject.next(items);
  }

  deleteItemOrder(itemOrder: ItemOrder): void {
    let currentItems = this.itemsSubject.getValue();
    currentItems = currentItems.filter(item => item !== itemOrder);
    this.itemsSubject.next(currentItems);
    console.log(this.itemsSubject)
  }

  // Agregar arreglos de objetos al servicio
  addItems(items: ItemOrder[]): void {
    const currentItems = this.itemsSubject.value;
    this.itemsSubject.next([...currentItems, ...items]);
  }

  setEditingItem(itemOrder: ItemOrder): void {
    this.selectedProductSubject.next(itemOrder);
  }

  clearEditingItem(): void {
    this.selectedProductSubject.next(null);
  }


  getSelectedProduct(): ItemOrder | void {
    return this.selectedProductSubject.value;
  }


  // Agregar un solo objeto al servicio
  addItem(item: ItemOrder): void {
    const currentItems = this.itemsSubject.value;
    this.itemsSubject.next([...currentItems, item]);
  }

  getItemsOrder(): ItemOrder[]|null{
    return this.itemsSubject.value;
  }


  //Getting object ItemOrder temporal
  getItemOrder(): ItemOrder|null{
    return this.itemOrderSubject.value;
  }

  //Set object ItemOrder temporal on service
  setItemOrder(itemOrder: ItemOrder): void{
    this.itemOrderSubject.next(itemOrder);
  }

  clearItems(): void {
    this.itemsSubject.next([]); // You can set it to any initial or empty value
  }


  //Getting object ItemOrder temporal
  getOrder(): Order|null{
    return this.orderSubject.value;
  }

  //Set object ItemOrder temporal on service
  setOrder(order: Order): void{
    this.orderSubject.next(order);
  }

}


