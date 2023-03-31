import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PedidoService } from 'src/app/services/pedido.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-listado-pedidos-propios',
  templateUrl: './listado-pedidos-propios.component.html',
  styleUrls: ['./listado-pedidos-propios.component.css']
})
export class ListadoPedidosPropiosComponent implements OnInit, OnDestroy {
  private subscription : Subscription;
  listado : any;
  page: number=0;
  search : string='';
  constructor(private servicioPedido : PedidoService){}
  ngOnDestroy(): void {
  this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription = new Subscription();
    this.cargarTabla();
  }

  cargarTabla() : void{
    this.subscription.add(
      this.servicioPedido.obtenerPropios().subscribe({
        next: (r: ResultadoGenerico) => {
          if(r.ok) {
            this.listado = r.resultado;
          }
          else {
            console.error(r.mensaje);
          }
        },
        error: (e) => {
          Swal.fire({title:'Error!', text: `Error al listar mis pedidos`, icon: 'error'});
          console.error(e);
        }
      })
    )
  }

  onSearchProduct(buscar : string){
    this.page=0;
    this.search=buscar.toLowerCase();
  }

  prevPage(){
    if(this.page>0){
      this.page-=6;
    }
  }

  nextPage(){
    this.page+=6;
  }


}
