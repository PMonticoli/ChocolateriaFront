import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models/pedido';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PedidoService } from 'src/app/services/pedido.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-cancelar-pedido',
  templateUrl: './cancelar-pedido.component.html',
  styleUrls: ['./cancelar-pedido.component.css']
})
export class CancelarPedidoComponent implements OnInit, OnDestroy{
private subscription : Subscription;
@Input() pedido : any;
@Output() onCancelado = new EventEmitter();
constructor(private servicioPedido : PedidoService){}

  ngOnInit(): void {
    this.subscription= new Subscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cancelarPedido() : void{
    if(!this.pedido.id){
      console.error("pedido id no definido");
      return;
    }
    this.subscription.add(
      this.servicioPedido.cancelar(this.pedido.id).subscribe({
        next : (res : ResultadoGenerico)=>{
          if(res.ok){
            Swal.fire({title:'Listo!', text:'Pedido cancelado con exito', icon: 'success'});
            this.onCancelado.emit();
          } else {
            Swal.fire({title:'Error!', text:`Ocurrió un error al cancelar el pedido: ${res.mensaje}`, icon: 'error'});
          }
        },
        error : (err)=>{
          console.error(err);
        }
      })
    )
  }

}
