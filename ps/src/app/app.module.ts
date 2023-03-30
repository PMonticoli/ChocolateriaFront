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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListadoPedidosPendientesComponent } from './components/pedidos/listados/listado-pedidos-pendientes/listado-pedidos-pendientes.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CobroComponent } from './components/pedidos/cobro/cobro.component';
import { CobroService } from './services/cobro.service';
import { TipoPagoService } from './services/tipo-pago.service';
import { ListadoPedidosPropiosComponent } from './components/pedidos/listados/listado-pedidos-propios/listado-pedidos-propios.component';
import { AltaSocioComponent } from './components/socios/alta-socio/alta-socio.component';
import { ListadoSociosComponent } from './components/socios/listado-socios/listado-socios.component';
import { SocioService } from './services/socio.service';
import { DetallesSocioComponent } from './components/socios/detalles-socio/detalles-socio.component';
import { BajaSocioComponent } from './components/socios/baja-socio/baja-socio.component';
import { AltaProductoComponent } from './components/productos/alta-producto/alta-producto.component';
import { ListadoProductosComponent } from './components/productos/listado-productos/listado-productos.component';
import { BajaProductoComponent } from './components/productos/baja-producto/baja-producto.component';
import { RegistroUsuarioExternoComponent } from './components/usuarios/registro-usuario-externo/registro-usuario-externo.component';
import { FiltroPipe } from './pipes/filtro.pipe';
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
    EstadoPedidoComponent,
    ListadoPedidosPendientesComponent,
    CobroComponent,
    ListadoPedidosPropiosComponent,
    AltaSocioComponent,
    ListadoSociosComponent,
    DetallesSocioComponent,
    BajaSocioComponent,
    AltaProductoComponent,
    ListadoProductosComponent,
    BajaProductoComponent,
    RegistroUsuarioExternoComponent,
    FiltroPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatInputModule
  ],
  providers: [
    UsuarioService,
    SesionIniciadaService,
    ProductoService,
    PedidoService,
    EstadoPedidoService,
    CobroService,
    TipoPagoService,
    SocioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
