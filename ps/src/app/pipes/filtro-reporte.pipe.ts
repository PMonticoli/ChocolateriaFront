import { Pipe, PipeTransform } from '@angular/core';
import { DtoReporte } from '../models/dto-reporte';

@Pipe({
  name: 'filtroReporte'
})
export class FiltroReportePipe implements PipeTransform {
  transform(producto: DtoReporte[], page: number=0, search : string): DtoReporte[] {
    if(search.length === 0){
      return producto.slice(page, page+5);
    }
    const productosFiltrados = producto.filter(prod=>  prod.nombre.normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").includes(search));
    return productosFiltrados.slice(page, page+5);
  }

}
