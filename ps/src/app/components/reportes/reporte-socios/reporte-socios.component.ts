import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { SocioService } from 'src/app/services/socio.service';
const Swal = require('sweetalert2');
import html2canvas from 'html2canvas';
import { ChartData } from 'chart.js';
@Component({
  selector: 'app-reporte-socios',
  templateUrl: './reporte-socios.component.html',
  styleUrls: ['./reporte-socios.component.css']
})
export class ReporteSociosComponent implements OnInit, OnDestroy{
private subscription : Subscription;
formulario : FormGroup;
visibilidadReporte : boolean= false;
body : any;
cantSociosNuevos : number = 0;
cantidadSociosBaja : number = 0;
datos: ChartData<'bar'>;
pedidosSocios : any[];
sociosConMasPuntos: any[];
private encabezado : string[] = ['Gráfico cantidad de socios'];
constructor(private servicioSocio : SocioService,
            private formBuilder : FormBuilder){}

ngOnInit(): void {
  this.subscription = new Subscription();
  this.formulario= this.formBuilder.group({
    fechaDesde : [,Validators.required],
    fechaHasta : [,Validators.required]
  })
}

ngOnDestroy(): void {
  this.subscription.unsubscribe();
}

get controlFechaDesde () : FormControl{
  return this.formulario.controls['fechaDesde'] as FormControl
}

get controlFechaHasta() : FormControl{
  return this.formulario.controls['fechaHasta'] as FormControl
}

getCantSociosNuevos(){
  const {fechaDesde, fechaHasta} = this.formulario.value;
  this.body = {
    fechaDesde : new Date(fechaDesde),
    fechaHasta : new Date(fechaHasta)
  }
  this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
  this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);

  this.subscription.add(
    this.servicioSocio.sociosNuevos(this.body).subscribe({
      next : (res : ResultadoGenerico)=>{
        if(res.ok){
          this.cantSociosNuevos=res.resultado ? res.resultado[0].cantSociosNuevos : 0;
          this.getCantSociosBaja();
        }
      },
      error : (err)=>{
        Swal.fire({title : 'Error', text:`Error al generar reporte socios: ${err}`, icon: 'error'})
      }
    })
  )
}

getSociosConMasPedidos() {
  this.subscription.add(
    this.servicioSocio.sociosConMasPedidos(this.body).subscribe({
      next : (res: ResultadoGenerico) =>{    
        console.log('Socios con mas pedidos :'+ JSON.stringify(res));
        if(res.ok){ 
          this.pedidosSocios=res.resultado ? res.resultado: [];
        }
        this.obtenerSociosConMasPuntos();
      },
      error :(e) =>{
        Swal.fire({title:'Error!', text:`Error al generar reporte socios: ${e}`, icon: 'error'});
      }
    })
  )
}

getCantSociosBaja() {
  this.subscription.add(
    this.servicioSocio.sociosBaja(this.body).subscribe({
      next : (res: ResultadoGenerico) =>{    
        console.log(res);
        if(res.ok){ 
          this.cantidadSociosBaja=res.resultado ? res.resultado[0].cantidadSociosBaja : 0;
        }
        this.getSociosConMasPedidos();
      },
      error :(e) =>{
        Swal.fire({title:'Error!', text:`Error al generar reporte socios: ${e}`, icon: 'error'});
      }
    })
  )
}

obtenerSociosConMasPuntos(): void {
  this.subscription.add(
    this.servicioSocio.getSociosConMasPuntos(8).subscribe({
      next: (r: ResultadoGenerico) => {
        if(r.ok) {
          this.sociosConMasPuntos = r.resultado? r.resultado : [];
          this.cargar();
        } else {
          console.error(r.mensaje);
        }
      },
      error: (err) => {
        Swal.fire({title:'Error!', text:`Error al generar reporte socios: ${err}`, icon: 'error'});
        console.error(err);
      }
    })
  )
}


cargar(): void {
  this.datos = {
    labels: this.encabezado,
    datasets: [
      {
        label : 'Socios nuevos',
        data: [
          this.cantSociosNuevos
        ],
      },
      {
        label : 'Socios bajas',
        data: [
        this.cantidadSociosBaja 
        ]
      },
    ],
  };
}


generarReporte(){
  if (this.formulario.valid) {
    this.visibilidadReporte = true;
    this.getCantSociosNuevos();
  } else { 
    Swal.fire({title:'Atención!', text:'¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning'});
  }
}

}
