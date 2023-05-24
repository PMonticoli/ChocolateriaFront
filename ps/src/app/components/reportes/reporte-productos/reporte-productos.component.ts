import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');
import html2canvas from 'html2canvas';
import { ChartData} from 'chart.js';
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
  resultadoCantidad : DtoReporte[] = [];
  resultadoPromedio: DtoReporte[] = [];
  search : string= '';
  page : number = 0;
  filtroTabla = new FormControl('nombre');
  cantidadProd : number =0;
  promedioProd : number =0;
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

  getCantidad() {
    if (!this.formulario.valid) {
      Swal.fire({title:'Atención!', text:'¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning'});
      return;
    }
    this.visibilidadReporte = true;
    if (this.formulario.valid) {
      const {fechaDesde, fechaHasta} = this.formulario.value;
      this.body = {
        fechaDesde: new Date(fechaDesde),
        fechaHasta: new Date(fechaHasta)
      };
      this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
      this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);
  
      this.subscription.add(
        this.servicioProducto.reporteCantidad(this.body).subscribe({
          next: (res: ResultadoGenerico) => {
            if (res.ok) {
              this.cantidadProd = res.resultado ? res.resultado[0].cantidadProd : 0;
              this.resultadoCantidad = res.resultado ? res.resultado : [];
              this.cargar();
            } else {
              console.error(res.mensaje);
            }
          },
          error: (err) => {
            console.error(err);
          }
        })
      );
    } else {
      Swal.fire({title:'Atención!', text:'¡Completar campos de fechas!', icon: 'warning'});
    }
  }
  
  getPromedio() {
    if (!this.formulario.valid) {
      Swal.fire({title:'Atención!', text:'¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning'});
      return;
    }
    this.visibilidadReporte = true;
    if (this.formulario.valid) {
      const {fechaDesde, fechaHasta} = this.formulario.value;
      this.body = {
        fechaDesde: new Date(fechaDesde),
        fechaHasta: new Date(fechaHasta)
      };
      this.body.fechaHasta.setHours(this.body.fechaHasta.getHours() + 23);
      this.body.fechaHasta.setMinutes(this.body.fechaHasta.getMinutes() + 59);
  
      this.subscription.add(
        this.servicioProducto.reportePromedio(this.body).subscribe({
          next: (res: ResultadoGenerico) => {
            if (res.ok) {
              this.promedioProd = res.resultado ? res.resultado[0].promedioProd : 0;
              this.resultadoPromedio = res.resultado ? res.resultado : [];
              this.cargar();
            } else {
              console.error(res.mensaje);
            }
          },
          error: (err) => {
            console.error(err);
          }
        })
      );
    } else {
      Swal.fire({title:'Atención!', text:'¡Completar campos de fechas!', icon: 'warning'});
    }
  }

  solicitarReporte() {
    if (this.formulario.valid) {
      this.visibilidadReporte = true;
      this.getCantidad();
      this.getPromedio();
    } else {
      Swal.fire({title:'Atención!', text:'¡Debes seleccionar previamente una fecha desde y hasta para generar el reporte!', icon: 'warning'});
    }
  }
  
  
  cargar(): void {
    const colores: { [producto: string]: string } = {};
  
    this.datosCantidad = {
      labels: ['Cantidad vendida por cada producto'],
      datasets: [],
    };
  
    this.datosPromedio = {
      labels: ['Promedio de venta por cada producto'],
      datasets: [],
    };
  
    // Crear un mapa de cantidad por nombre de producto
    const cantidadPorProducto: { [nombre: string]: number } = {};
    for (const fila of this.resultadoCantidad) {
      cantidadPorProducto[fila.nombre] = fila.cantidad;
    }
  
    // Iterar sobre los resultados de promedio y construir los conjuntos de datos
    for (const fila of this.resultadoPromedio) {
      const nombreProducto = fila.nombre;
  
      // Generar un color aleatorio si el producto aún no tiene uno asignado
      if (!colores[nombreProducto]) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const color = `rgb(${r}, ${g}, ${b})`;
        colores[nombreProducto] = color;
      }
  
      const colorProducto = colores[nombreProducto];
      const cantidad = cantidadPorProducto[nombreProducto] || 0;
  
      this.datosCantidad.datasets.push({
        label: nombreProducto,
        data: [cantidad],
        backgroundColor: colorProducto,
      });
  
      this.datosPromedio.datasets.push({
        label: nombreProducto,
        data: [fila.promedio],
        backgroundColor: colorProducto,
      });
    }
  
    // Ordenar los datos en ambos conjuntos de datos en el mismo orden
    this.datosCantidad.datasets.sort((a, b) => {
      if (a.data && b.data && typeof a.data[0] === 'number' && typeof b.data[0] === 'number') {
        return b.data[0] - a.data[0];
      }
      return 0;
    });
  
    this.datosPromedio.datasets.sort((a, b) => {
      if (a.data && b.data && typeof a.data[0] === 'number' && typeof b.data[0] === 'number') {
        return b.data[0] - a.data[0];
      }
      return 0;
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
      let pageHeight = ArchivoPDF.internal.pageSize.getHeight();
  
      if (altura > pageHeight - 20) {
        altura = pageHeight - 20; 
      }
  
      ArchivoPDF.addImage(urlArchivo, 'PNG', 10, 10, ancho, altura);
  
      console.log(new Date().toLocaleDateString("es-AR"));
      ArchivoPDF.save(`Reporte Productos (${new Date().toLocaleDateString("es-AR")}).pdf`);
    });
  }
  
  

  get controlFechaDesde () : FormControl{
    return this.formulario.controls['fechaDesde'] as FormControl;
  }

  get controlFechaHasta () : FormControl{
    return this.formulario.controls['fechaHasta'] as FormControl;
  }

  nextPage(){
    this.page+=4;
  }

  prevPage(){
    if(this.page>0){
      this.page-=4;
    }
  }

  pageProm : number=0;
  nextPageProm(){
    this.pageProm+=4;
  }

  prevPageProm(){
    if(this.pageProm>0){
      this.pageProm-=4;
    }
  }

  onSearchProduct(buscar : string){
      this.page=0;
      this.search=buscar.toLowerCase().normalize('NFD').toLowerCase()
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1");
  }

}
