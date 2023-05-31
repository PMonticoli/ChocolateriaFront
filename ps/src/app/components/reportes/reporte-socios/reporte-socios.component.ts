import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { SocioService } from 'src/app/services/socio.service';
const Swal = require('sweetalert2');
import html2canvas from 'html2canvas';
import { ChartData } from 'chart.js';
import { jsPDF } from "jspdf";
import { DtoSocios } from 'src/app/models/dto-socios';
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
pedidosSocios : DtoSocios[];
sociosConMasPuntos: DtoSocios[];
private encabezado : string[] = ['Gráfico cantidad de socios'];
search : string= '';
page : number = 0;
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
          if(this.body.fechaDesde> this.body.fechaHasta){
            Swal.fire({title : 'Atención!', text:`Ingrese fechas validas:`, icon: 'warning'});
            this.visibilidadReporte= false;
            return;
          }
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
        backgroundColor: 'rgb(31 120 50)'
      },
      {
        label : 'Socios bajas',
        data: [
        this.cantidadSociosBaja 
        ],
        backgroundColor: 'rgba(255, 0, 0, 0.8)'
      },
    ],
  };
}


solicitarReporte(){
  if (this.formulario.valid) {
    this.visibilidadReporte = true;
    this.getCantSociosNuevos();
  } else { 
    Swal.fire({title:'Atención!', text:'¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning'});
  }
}

descargarPDF(): void {
  let DATA: any = document.getElementById('htmlData');
  html2canvas(DATA).then((canvas) => {
    let ancho = 290;
    let altura = (canvas.height * ancho) / canvas.width;
    const urlArchivo = canvas.toDataURL('image/png');
    let ArchivoPDF = new jsPDF('l', 'mm', 'a4');
    let position = 0;
    let pageHeight = ArchivoPDF.internal.pageSize.getHeight();

    // Verifica si la altura de la imagen supera la altura de la página
    if (altura > pageHeight - 20) {
      altura = pageHeight - 20; // Resta el alto de los márgenes superior e inferior
    }

    ArchivoPDF.addImage(urlArchivo, 'PNG', 10, 10, ancho, altura);

    console.log(new Date().toLocaleDateString("es-AR"));
    ArchivoPDF.save(`Reporte Socios (${new Date().toLocaleDateString("es-AR")}).pdf`);
  });
}
nextPage(){
  this.page+=4;
}

prevPage(){
  if(this.page>0){
    this.page-=4;
  }
}

onSearchProduct(buscar : string){
    this.page=0;
    this.search=buscar.toLowerCase().normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1");
}
}
