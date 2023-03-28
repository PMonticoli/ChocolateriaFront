import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.css']
})
export class ListadoProductosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'Nombre', 'Descripcion', 'Observaciones','Precio', 'Puntos Ganados', 
    'Activo', 'Disponible' ,'Eliminar','Editar'    
  ];
  dataSource!: MatTableDataSource<Producto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private subscription = new Subscription();
  listado: any;

  constructor(private servicioProducto : ProductoService){}

  ngOnInit(): void {
    this.cargarTabla();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarTabla(): void{
    this.subscription.add(
      this.servicioProducto.obtenerTodos().subscribe({
        next: (res: ResultadoGenerico) => {
          if(res.ok) {
            this.listado = res.resultado;
            this.dataSource = new MatTableDataSource(this.listado);
            this.dataSource.paginator = this.paginator;
          }
          else {
            console.error(res.mensaje);
          }
        },
        error: (e) => {
          Swal.fire({title:'Error!', text: `Error al intentar cargar listado de productos`, icon: 'error'});
          console.error(e);
        }
      })
    )
  }
}
