import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PedidoService } from 'src/app/services/pedido.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Pedido } from 'src/app/models/pedido';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-listado-pedidos-propios',
  templateUrl: './listado-pedidos-propios.component.html',
  styleUrls: ['./listado-pedidos-propios.component.css']
})
export class ListadoPedidosPropiosComponent implements OnInit, OnDestroy {
  private subscription : Subscription;
  listado : any;
  displayedColumns: string[] = [
    'Estado', 'FechaPedido' ,'Detalles', 'Acciones'
  ];
  dataSource!: MatTableDataSource<Pedido>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
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
        next : (res : ResultadoGenerico)=>{
          if(res.ok){
            this.listado = res.resultado;
            this.dataSource = new MatTableDataSource(this.listado);
            this.dataSource.paginator = this.paginator;
          }else{
            console.error(res.mensaje);
          }
        },
        error : (err)=>{
          Swal.fire({title:'Error!', text: `Error al intentar actualizar tu listado de pedidos`, icon: 'error'});
          console.error(err);
        }
      })
    )
  }


}
