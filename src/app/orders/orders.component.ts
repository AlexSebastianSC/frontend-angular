import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Order } from './order';
import { OrdersSharedDataService } from './orders-shared-data.service';
import { DataService } from '../addedit/data-service.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent {

  orders: Order[] = [];
  data: any;
  selectedOrderToDelete:number;
  //dataItem:any;
  loading: boolean = true;
  creatingNewOrder: boolean = false;

  constructor( private router: Router,
    private route: ActivatedRoute,
    private ordersSharedDataService: OrdersSharedDataService,
    private dataService: DataService) {}

  ngOnInit() {

    this.ordersSharedDataService.getOrders().subscribe(
      (response) => {
        this.data = response;
        this.loading =false;
      },(error)=>{
        console.log('Error loading orders: ',error);
        this.loading=false;
      }
  );
  }


   createNewOrder(){
    this.ordersSharedDataService.setCreatingNewOrder(true);
    this.router.navigate(['/addedit/form/newOrder']);
  }

  redirectToOrderDetails(orderId: number): any {
    this.ordersSharedDataService.getOrderDetails(orderId).subscribe(
      (dataItem) => {
        // Lógica adicional si es necesario
        this.ordersSharedDataService.dataItem = dataItem;
      },
      (error) => {
        console.error('Error loading order details: ', error);
      }
    );
  }

  editOrder(order: any, orderId: number): void {
    console.log("Id de la orden: ",orderId);
    this.dataService.fetchItems(orderId).subscribe((items) => {
      console.log("Productos recibidos:", items);
      this.dataService.setItems(items);
    });

    this.dataService.setOrder(order);
    console.log("this.dataService.getOrder",this.dataService.getOrder())
    this.router.navigate(['/addedit/form', orderId]);

  }

  confirmDelete(order: any) {
    if (confirm('¿Estás seguro de que quieres eliminar esta orden?')) {
      this.deleteOrder(order);
    }
  }

  deleteOrder(order: Order): void {
    this.selectedOrderToDelete = order.orderId;
    this.ordersSharedDataService.deleteItemsOrder(order.orderId);
    this.ordersSharedDataService.deleteOrder(order.orderId);
    window.location.reload();
  }

  loadOrders() {
    this.ordersSharedDataService.getOrders().subscribe(
      (orders) => {
        this.orders = orders;
      },
      (error) => {
        console.error('Error al cargar las órdenes', error);
      }
    );
  }



}
