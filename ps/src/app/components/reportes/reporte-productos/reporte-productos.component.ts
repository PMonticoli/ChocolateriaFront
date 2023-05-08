import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');
import html2canvas from 'html2canvas';
import { ChartData } from 'chart.js';
import { jsPDF } from "jspdf";
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { DtoReporte } from 'src/app/models/dto-reporte';

@Component({
  selector: 'app-reporte-productos',
  templateUrl: './reporte-productos.component.html',
  styleUrls: ['./reporte-productos.component.css']
})
export class ReporteProductosComponent implements OnInit, OnDestroy{
  private subscription = new Subscription();
  formulario : FormGroup;
  visibilidadReporte : boolean= false;
  datosCantidad: ChartData<'bar'>;
  datosPromedio: ChartData<'bar'>;
  body : any;
  resultadoReporte: DtoReporte[] = [];
  search : string= '';
  page : number = 0;
  constructor(private servicioProducto : ProductoService,
             private formBuilder : FormBuilder){}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      fechaDesde : [,Validators.required],
      fechaHasta : [,Validators.required]
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  solicitarReporte(){
    if (!this.formulario.valid) {
      Swal.fire({title:'Atención!', text:'¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning'});
      return;
    }
    this.visibilidadReporte = true;
    if(this.formulario.valid){
      const {fechaDesde, fechaHasta} = this.formulario.value;
      this.body = {
        fechaDesde: new Date(fechaDesde),
        fechaHasta: new Date(fechaHasta)
      }
      this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
      this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);
  
      this.subscription.add(
        this.servicioProducto.reporteCantPromedio(this.body).subscribe({
          next: (res: ResultadoGenerico) => {
            if (res.ok) {
              this.resultadoReporte = res.resultado ? res.resultado : [];
              this.cargar();
            }
            else {
              console.error(res.mensaje);
            }
          },
          error: (err) => {
            console.error(err);
          }
        }))
    }else{
      alert ('¡Completar campos de fechas!')
    }
  }

  cargar(): void {
    this.datosCantidad = {
      labels: ['Cantidad vendida por cada producto'],
      datasets: [
      ],
    };
    this.resultadoReporte.forEach(fila => {
      this.datosCantidad.datasets.push(
        {
          label : fila.nombre,
          data: [
            fila.cantidad
          ],
        }
      );

    });
    this.datosPromedio = {
        labels: ['productos'],
        datasets: [
        ],
      };

    this.resultadoReporte.forEach(fila => {
      this.datosPromedio.datasets.push(
        {
          label : fila.nombre,
          data: [
            fila.promedio
          ],
        }
      );

    });
  }

  descargarPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let ancho = 290;
      let altura = (canvas.height * ancho) / canvas.width;
      const urlArchivo = canvas.toDataURL('image/png');
      let ArchivoPDF = new jsPDF('l', 'mm', 'a4');
      let position = 0;
      ArchivoPDF.addImage(urlArchivo, 'PNG', 0, position, ancho, altura);
      console.log(new Date().toLocaleDateString("es-AR"));
      ArchivoPDF.save(`Reporte Socios (${new Date().toLocaleDateString("es-AR")}).pdf`);
    });
  }

  get controlFechaDesde () : FormControl{
    return this.formulario.controls['fechaDesde'] as FormControl;
  }

  get controlFechaHasta () : FormControl{
    return this.formulario.controls['fechaHasta'] as FormControl;
  }

  nextPage(){
    this.page+=6;
  }

  prevPage(){
    if(this.page>0){
      this.page-=6;
    }
  }

  onSearchProduct(buscar : string){
      this.page=0;
      this.search=buscar.toLowerCase().normalize('NFD').toLowerCase()
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1");
  }

}
