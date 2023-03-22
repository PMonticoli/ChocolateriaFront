import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PedidoService } from 'src/app/services/pedido.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-listado-pedidos-pendientes',
  templateUrl: './listado-pedidos-pendientes.component.html',
  styleUrls: ['./listado-pedidos-pendientes.component.css']
})
export class ListadoPedidosPendientesComponent implements OnInit {
  private subscription : Subscription;
  listado : any;

  constructor(private servicioPedido : PedidoService){}
  ngOnInit(): void {
    this.subscription = new Subscription();
    this.cargarTabla();
  }

  cargarTabla() : void{
    this.subscription.add(
      this.servicioPedido.obtenerPendientes().subscribe({
        next : (res : ResultadoGenerico)=>{
          if(res.ok){
            this.listado=res.resultado;
          }else{
            console.error(res.mensaje);
          }
        },
        error :(e)=>{
          Swal.fire({title:'Error!', text: `Error al intentar cargar listado pedidos pendientes`, icon: 'error'});
          console.error(e);
        }
      })
    )
  }

}
