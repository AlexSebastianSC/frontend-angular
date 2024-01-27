import { Injectable } from '@angular/core';
import { ItemOrder } from './itemOrder';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  private itemOrders: ItemOrder[] = [];
  editingItem: { itemOrder: ItemOrder, index: number };
  editingItemIndex: number = -1;

  constructor() { }
  getItemOrders(): ItemOrder[] {
    return this.itemOrders;
  }

  dropItemOrders(): void{
    this.itemOrders = [];
  }

  addItemOrder(itemOrder: ItemOrder): void {
    this.itemOrders.push(itemOrder);
  }

  deleteItemOrder(itemOrder: ItemOrder): void {
    const index = this.itemOrders.indexOf(itemOrder);
    if (index !== -1) {
      this.itemOrders.splice(index, 1);
    }
  }

  updateItemOrder(index: number, newItemOrder: ItemOrder): void {
    console.log(index,newItemOrder);
    this.itemOrders[index] = null;
    this.itemOrders[index] = newItemOrder;
  }

  // Nuevo método para establecer el item y el índice de edición
  setEditingItem(itemOrder: ItemOrder, index: number): void {
    this.editingItem = { itemOrder, index };
  }

  getEditingItem(): ItemOrder {
    return this.editingItem.itemOrder;
  }

  clearEditingItem(): void {
    this.editingItem = null;
    this.editingItemIndex = -1;
  }



}
