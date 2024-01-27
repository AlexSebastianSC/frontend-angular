import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService} from './product.service';
import { Product } from './product';
import { ItemOrder } from './itemOrder';
import { DataService } from './data-service.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-formproducts',
  templateUrl: './formproducts.component.html',
})
export class FormproductsComponent implements OnInit{
  electedProduct: Product;
  selectedProductId: number;
  selectedProductPrice: number;
  quantity: number = 1;

  products: Product[] =[];
  itemOrders: ItemOrder[] = [];
  selectedProduct: Product;
  availableProducts: Product[] = [];
  isEditing : boolean =false;
  editedItemIndex: number;

  constructor(private router: Router,
    private productService: ProductService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location ) {}

  ngOnInit(): void {

    this.route.params.subscribe(params=>{
      const productId = +params['productId'];
      if(productId){
        this.isEditing = true;
        this.loadSelectedProduct(productId);
      }else{
        this.productService.getProductos().subscribe(data => {
          this.products = data as Product[];
          this.updateAvailableProducts();
        })
      }
    })

  }

  onCancelButtonClick(): void {
    this.location.back();
  }


  loadSelectedProduct(productId: number): void {
    const editedProduct = this.dataService.getSelectedProduct(); //sharedDataService.getEditingItem();
    console.log(editedProduct)
    if(editedProduct){
      console.log(editedProduct.productUnitPrice)
      this.selectedProduct = {
        productId:editedProduct.id.productId,
        productName: editedProduct.productName,
        productPrice: editedProduct.productUnitPrice,
      }
      this.quantity = editedProduct.quantity;
    }
    this.selectedProductId = this.selectedProduct.productId;
    this.selectedProductPrice =  this.selectedProduct.productPrice;
    console.log(this.selectedProductId);
    console.log(this.selectedProductPrice)

  }

  onChangeProduct(): void {
    if (this.selectedProductId !== null && this.selectedProductId !== undefined) {
      this.selectedProduct = this.products.find(product => product.productId === Number(this.selectedProductId));
      this.selectedProductPrice = this.selectedProduct ? this.selectedProduct.productPrice : null;

    }
  }

  calculateTotalPrice(): number {
    const totalPrice = +(this.selectedProductPrice * this.quantity).toFixed(2);
    if (totalPrice){
      return totalPrice;
    }else{
      return 0
    }
  }

  onOKButtonClick(): void{

    if (this.selectedProduct) {
      if(!this.dataService.getCreatedMode()){

      const newItemOrder: ItemOrder = {
        id: {orderId: this.dataService.getOrder().orderId,
          productId: this.selectedProduct.productId,
        },
        productName: this.selectedProduct.productName,
        productUnitPrice: this.selectedProduct.productPrice,
        quantity: this.quantity,
        productTotalPrice: this.calculateTotalPrice(),
      };
      console.log("new itemOrder: ",newItemOrder);
    }else{
      const provisionalOrderId = -1;

    // Agrega los ítems con el orderId provisional
    const newItemOrder: ItemOrder = {
      id: {
        orderId: provisionalOrderId,
        productId: this.selectedProduct.productId,
      },
      productName: this.selectedProduct.productName,
      productUnitPrice: this.selectedProduct.productPrice,
      quantity: this.quantity,
      productTotalPrice: this.calculateTotalPrice(),
    }
      // Obtén la lista actual de ítems del servicio

    const currentItems = this.dataService.getItemsOrder();

    // Busca el ítem existente en la lista por productId
    const existingItemIndex = currentItems.findIndex(item => item.id.productId === newItemOrder.id.productId);

    if (existingItemIndex !== -1) {
      // Si el ítem ya existe, actualiza su valor en la lista
      currentItems[existingItemIndex] = newItemOrder;
    } else {
      // Si el ítem no existe, agrégalo a la lista
      currentItems.push(newItemOrder);
    }

    // Actualiza la lista de ítems en el servicio
    this.dataService.setItems(currentItems);

    // Limpia el ítem de edición
    this.dataService.clearEditingItem();

    // Navega hacia atrás
    this.location.back();
  }
  }
}

  updateAvailableProducts(): void {
    console.log('All Products:', this.products);

    const allProducts = this.products;

    const selectedProductIds = this.dataService.getItemsOrder().map(itemOrder => itemOrder.id.productId);
    console.log("Ids presentes: ",selectedProductIds);
    this.availableProducts = allProducts.filter(product => !selectedProductIds.includes(product.productId));
    console.log("Ids dispoonibles: ",this.availableProducts);

  }


}
