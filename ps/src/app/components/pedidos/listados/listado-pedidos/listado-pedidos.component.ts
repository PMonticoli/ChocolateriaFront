import { Component, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models/pedido';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PedidoService } from 'src/app/services/pedido.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.css'],
})
export class ListadoPedidosComponent implements OnInit {
  displayedColumns: string[] = [
    'Punto de Venta', 'Socio', 'Empleado', 'Estado', 'Observaciones', 'Fecha', 'Acciones'
  ];
  dataSource!: MatTableDataSource<Pedido>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  private subscription = new Subscription();
  listado: any;

  constructor(private servicioPedido: PedidoService) {}

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
            this.dataSource = new MatTableDataSource(this.listado);
            this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
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


  

