import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { Pedido } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-alta-pedido',
  templateUrl: './alta-pedido.component.html',
  styleUrls: ['./alta-pedido.component.css']
})
export class AltaPedidoComponent implements OnInit, OnDestroy {
  cantidadTotal: number = 0;
  montoTotal: number = 0;
  controlObservaciones = new FormControl('');
  productos: Producto[];
  pedido: Pedido;
  mostrarPedido : boolean = false;
  private subscription: Subscription
  constructor(
    private servicioProducto: ProductoService,
    private servicioPedido: PedidoService,
    private router: Router
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.getProductos();
    this.pedido = new Pedido();
    this.pedido.detalles = [];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProductos(): void {
    this.subscription.add(
      this.servicioProducto.obtenerActivos().subscribe({
        next: (resultado: ResultadoGenerico) => {
          if (resultado.ok) {
            this.productos = resultado.resultado as Producto[];
          }
          else {
            console.error(resultado.mensaje)
          }
        },
        error: (e) => { console.error(e) }
      })
    )
  }

  calcularTotal(): void {
    let total = 0;
    this.pedido.detalles.forEach(x => {
      total = total + x.producto.precio * x.cantidad;
    });
    this.montoTotal = total;
  }

  calcularCantidadTotal(): void {
    let total = 0;
    this.pedido.detalles.forEach(x => {
      total = total + x.cantidad;
    })
    this.cantidadTotal = total;
  }

  agregarDetalle(detalle: DetallePedido): void {
    this.pedido.detalles.push(detalle);
    this.calcularCantidadTotal();
    this.calcularTotal();
    this.mostrarPedido = true;
  }

  quitarDetalle(detalle: DetallePedido): void {
    this.pedido.detalles = this.pedido.detalles.filter(d => d !== detalle);
    this.calcularCantidadTotal();
    this.calcularTotal();
    this.mostrarPedido = this.pedido.detalles.length > 0;
}


  guardarPedido() {
    this.pedido.observaciones = this.controlObservaciones.value ? this.controlObservaciones.value : "";
    this.subscription.add(
      this.servicioPedido.agregar(this.pedido).subscribe({
        next: () => {
          if(this.pedido.detalles.length>0){
            Swal.fire({ title: 'Listo!', text: 'Registraste tu pedido con éxito.', icon: 'success' });
            this.router.navigate(['/home']);
          }else{
            Swal.fire({ title: 'Atención!', text: 'Selecciona al menos un producto antes de enviar el pedido.', icon: 'warning' });
          }
        },
        error: (e) => {
          Swal.fire({ title: 'Error!', text: 'Se produjo un error', icon: 'error' });
          console.error(e);
        }
      })
    )
  }

  estaAgregado(p: Producto): boolean {
    let condicion = this.pedido.detalles.find(x => x.producto === p);
    if (condicion) {
      return true;
    }
    return false;
  }
  search : string ="";
  onSearchProduct(buscar : string){
    this.search=buscar.toLowerCase().normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1");
}
}
