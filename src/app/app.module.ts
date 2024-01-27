import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule,Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
//import { FormComponent } from './clientes/form.component';
import { FormsModule } from '@angular/forms';
import { DatePipe, registerLocaleData } from '@angular/common';
import localES from '@angular/common/locales/es-PE';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { OrdersComponent } from './orders/orders.component';
import { FormComponent } from './addedit/form.component';
import { FormproductsComponent } from './addedit/formproducts.component';

registerLocaleData(localES, 'es');

const routes: Routes =[
  {path: '', redirectTo:'/orders/my-orders',pathMatch:'full'},
  {path: 'orders/my-orders', component:OrdersComponent},
  {path: 'addedit/form/newOrder', component:FormComponent},
  {path: 'addedit/form/:orderNumber', component:FormComponent},
  {path: 'addedit/formproducts/:orderNumber/newProduct', component:FormproductsComponent},
  {path: 'addedit/formproducts/updateProduct/:orderId/:productId', component:FormproductsComponent},
  {path: 'addedit/formproducts/createOrder/newProduct', component:FormproductsComponent},
  {path: 'addedit/formproducts/createOrder', component:FormComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FormComponent,
    OrdersComponent,
    FormproductsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatDatepickerModule

  ],
  providers: [{provide: LOCALE_ID, useValue: 'es' },DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
