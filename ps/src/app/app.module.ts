import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SesionIniciadaService } from './services/sesion-iniciada.service';
import { UsuarioService } from './services/usuario.service';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AltaPedidoComponent } from './components/pedidos/alta-pedido/alta-pedido.component';
import { ElementoProductoComponent } from './components/pedidos/elemento-producto/elemento-producto.component';
import { ListadoPedidosComponent } from './components/pedidos/listados/listado-pedidos/listado-pedidos.component';
import { ProductoService } from './services/producto.service';
import { PedidoService } from './services/pedido.service';
import { DetallesPedidoComponent } from './components/pedidos/detalles-pedido/detalles-pedido.component';
import { EstadoPedidoComponent } from './components/pedidos/estado-pedido/estado-pedido.component';
import { EstadoPedidoService } from './services/estado-pedido.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    AltaPedidoComponent,
    ElementoProductoComponent,
    ListadoPedidosComponent,
    DetallesPedidoComponent,
    EstadoPedidoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    UsuarioService,
    SesionIniciadaService,
    ProductoService,
    PedidoService,
    EstadoPedidoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
