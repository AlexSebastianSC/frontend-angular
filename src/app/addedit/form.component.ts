import { DataService } from './data-service.service';
import { Component,OnInit } from '@angular/core';
import { Order } from '../orders/order';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ItemOrder } from './itemOrder';
import { ProductService } from './product.service';
import { Observable } from 'rxjs';
import { OrdersSharedDataService } from '../orders/orders-shared-data.service';
import { Location } from '@angular/common';
import { Product } from './product';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {

  items: ItemOrder[]= [];
  loading: boolean= true;
  order$: Observable<Order>;
  orderDate: String;
  orderNumber: number;
  itemsUpdate: ItemOrder[]= [];
  actualQuantity: number;
  actualFinalPrice: number;

  isCreatingNewOrder: boolean = false;
  showSuccessAlert: boolean = false;

  itemOrders: ItemOrder[]= [];
  order:Order = new Order();
  titulo:string = "New order";
  isEditing :boolean =false;

  constructor(
    private dataService: DataService,
    private location: Location,
    private router: Router,
    private datePipe: DatePipe,
    private sharedDataService: DataService,
    private route: ActivatedRoute,
    private orderSharedDataService: OrdersSharedDataService) {}

  ngOnInit(){

    if(this.orderSharedDataService.isCreatingNewOrder()){
      this.initializeForm();
    }else{

      this.orderSharedDataService.setCreatingNewOrder(false);
      this.isEditing=true;
      const itemsOrderList: ItemOrder[] = this.dataService.getItemsOrder();
      const order = this.dataService.getOrder() || new Order();
      this.orderDate = this.dataService.getOrder().orderDate;
      this.orderNumber =  this.dataService.getOrder().orderId;

      this.itemsUpdate = itemsOrderList;

      this.actualQuantity = this.calculateTotalQuantity();
      this.actualFinalPrice = this.calculateTotalPrice();

      console.log("order: ",order);
      itemsOrderList.forEach(itemOrder => {
        console.log(itemOrder);

    });
    this.loading =false;
    console.log("productos que ya estan: ",this.itemsUpdate)

    }
  }

get itemsOrderList(): ItemOrder[] {
  this.dataService.setCreatedMode(true);
  return this.dataService.getItemsOrder();
}


// Method to handle events on forms
handleFormEvent(itemOrder: ItemOrder): void {
  this.dataService.setItemOrder(itemOrder);
}

addProductsEditing(isEditing: boolean):void{
  console.log("Estado: ",isEditing)
  if(isEditing){
    console.log("orderid: ...",this.dataService.getOrder().orderId)
    this.router.navigate(['/addedit/formproducts/', this.dataService.getOrder().orderId,'newProduct']);
  }else{
    this.router.navigate(['/addedit/formproducts/create/newProduct']);

  }
}

deleteItemOrder(itemOrder: ItemOrder): void {

  this.dataService.deleteItemOrder(itemOrder);
  this.itemsUpdate = this.dataService.getItemsOrder()
  console.log("this.dataService.getItemsOrder()", this.itemsUpdate);

}

cancelOrder(): void {
  this.dataService.clearItems();
  this.location.back();

}

calculateTotalQuantity(): number {
  return this.dataService.getItemsOrder().reduce((total, itemOrder) => total + itemOrder.quantity, 0);
}

calculateTotalPrice(): number {
  return parseFloat(this.dataService.getItemsOrder().reduce((total,itemOrder)=>total + itemOrder.productTotalPrice, 0).toFixed(2));
  //return 10;
}

addOrder() {

    if(this.dataService.getItemsOrder().length > 0 && this.orderSharedDataService.isCreatingNewOrder()){
      const body = this.generateOrderBody();
      this.orderSharedDataService.putOrder(body);
      this.orderSharedDataService.setCreatingNewOrder(false);
    }else if(this.dataService.getItemsOrder().length===0){
      alert('No hay productos en la orden')
    }

    if(!this.orderSharedDataService.isCreatingNewOrder() && this.itemsUpdate.length!==0){
      const bodyOrderUpdate = this.generateOrderUpdateBody();
      const bodyItemOrderUpdate = this.generateItemsOrderUpdateBody();
      this.orderSharedDataService.updateOrder(bodyOrderUpdate);
      this.orderSharedDataService.updateItemsOrder(bodyItemOrderUpdate);
    }else if(this.itemsUpdate.length===0){
      alert('No hay cambios.')
    }
    this.orderSharedDataService.setCreatingNewOrder(false);
    this.router.navigate(["/orders/my-orders"]);

  }

  initializeForm() {
    this.order = new Order();
    this.itemOrders = [];
  }

  editItemOrder(itemOrder: ItemOrder):void{
    this.dataService.setEditingItem(itemOrder);
    this.router.navigate(['addedit/formproducts/updateProduct/',itemOrder.id.orderId,itemOrder.id.productId]);
  }


  loadOrderDetails(orderId: number): void {


    this.orderSharedDataService.getOrderDetails(orderId).subscribe(data => {
      console.log(data);
      this.itemOrders = data;
    });

  }

  generateOrderUpdateBody():any{
      const quantity = parseFloat(this.itemsUpdate.reduce((total,item)=>total + item.quantity, 0).toFixed(2));
      const finalPrice = parseFloat(this.itemsUpdate.reduce((total,item)=>total + item.productTotalPrice, 0).toFixed(2));

      const bodyOrderUpdate = {
        orderId: this.dataService.getOrder().orderId,
        orderDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        numProducts: quantity,
        finalPrice:finalPrice,
      };
      console.log("bodyOrderUpdate",bodyOrderUpdate)
      return bodyOrderUpdate
  }

  generateItemsOrderUpdateBody():any{
    console.log("Update item body: ", this.itemsUpdate)
      const dtoBodyItemOrder = this.itemsUpdate.map((item: ItemOrder) => ({
      id:{
        orderId: this.dataService.getOrder().orderId,
        productId: item.id.productId,
      },
      productName: item.productName,
      productUnitPrice: item.productUnitPrice,
      quantity: item.quantity,
      productTotalPrice: item.productTotalPrice,
    }));
    console.log("dtoBodyItemOrder",dtoBodyItemOrder);
    return dtoBodyItemOrder;
  }



  generateOrderBody(): any {
    // Obtener la información necesaria del DataService
    const items = this.dataService.getItemsOrder();

    const bodyOrder = {
      orderDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),//new Date().toDateString(),
      numProducts: this.calculateTotalQuantity(),
      finalPrice: this.calculateTotalPrice(),
    };

    // Crear el arreglo de ítems del pedido
    const dtoBodyItemOrder = items.map((item: ItemOrder) => ({
      productId: item.id.productId,
      productName: item.productName,
      productUnitPrice: item.productUnitPrice,
      quantity: item.quantity,
      productTotalPrice: item.productTotalPrice,
    }));

    const aux = { bodyOrder,dtoBodyItemOrder };
    // Devolver el cuerpo completo
    this.dataService.clearItems();
    return aux;
  }



}
