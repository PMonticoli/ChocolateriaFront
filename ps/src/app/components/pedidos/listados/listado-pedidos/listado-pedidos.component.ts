import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.css'],
})
export class ListadoPedidosComponent implements OnInit {
  private subscription = new Subscription();
  constructor(private servicioPedido: PedidoService) {}
  listado: any;
  ngOnInit(): void {
    this.subscription = new Subscription();
    this.cargarTabla();
  }
  cargarTabla(): void{
    this.subscription.add(
      this.servicioPedido.obtenerTodos().subscribe({
        next: (r: ResultadoGenerico) => {
          if(r.ok) {
            this.listado = r.resultado;
          }
          else {
            console.error(r.mensaje);
          }
        },
        error: (e) => {
          console.error(e);
        }
      })
    )
  }

  
}
