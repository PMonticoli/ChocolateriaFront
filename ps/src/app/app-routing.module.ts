import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AltaPedidoComponent } from './components/pedidos/alta-pedido/alta-pedido.component';
import { ListadoPedidosComponent } from './components/pedidos/listados/listado-pedidos/listado-pedidos.component';

const routes: Routes = [
  {path : 'home', component : HomeComponent},
  {path : '', component : HomeComponent},
  {path : 'login', component: LoginComponent},
  {path : 'pedido/nuevo', component: AltaPedidoComponent},
  {path: 'pedido/listado', component: ListadoPedidosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
