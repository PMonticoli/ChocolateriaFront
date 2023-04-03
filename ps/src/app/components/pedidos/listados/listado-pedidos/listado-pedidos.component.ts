import { Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { PedidoService } from 'src/app/services/pedido.service';

const Swal = require('sweetalert2');
@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.css'],
})
export class ListadoPedidosComponent implements OnInit {
  private subscription = new Subscription();
  listado: any;
  page : number = 0;
  search : string ='';
  formulario : FormGroup;
  reqbody : any;
  constructor(private servicioPedido: PedidoService,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.cargarTabla();
    this.formulario = this.formBuilder.group({
      fechaDesde :[],
      fechaHasta :[]
    })
  }

  cargarTabla() : void{
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
          Swal.fire({title:'Error!', text: `Error al listar pedidos`, icon: 'error'});
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

  obtenerPorFecha(){
    if (!this.formulario.valid) {
      Swal.fire({title:'Atención!', text:'Primero debe ingresar una fecha desde y fecha hasta', icon: 'warning'});
      return;
    }
    if(this.formulario.valid){
      const {fechaDesde, fechaHasta} = this.formulario.value;
      this.reqbody = {
        fechaDesde: new Date(fechaDesde),
        fechaHasta: new Date(fechaHasta)
      }
      this.reqbody.fechaHasta.setHours(this.reqbody.fechaHasta.getHours() + 23);
      this.reqbody.fechaHasta.setMinutes(this.reqbody.fechaHasta.getMinutes() + 59);
  }

  this.subscription.add(
    this.servicioPedido.obtenerPorFecha(this.reqbody).subscribe({
      next: (res : ResultadoGenerico)=>{
        if(res.ok){
          this.listado=res.resultado;
        }else{
          Swal.fire({title: 'Error', text: 'Error al listar pedidos por fecha', icon: 'error'})
        }
      },
      error :(err)=>{
        console.error(err);
      }
    })
  )
}

get controlFechaDesde() : FormControl{
  return this.formulario.controls['fechaDesde'] as FormControl;
}

get controlFechaHasta() : FormControl{
  return this.formulario.controls['fechaHasta'] as FormControl;
}
  
}
