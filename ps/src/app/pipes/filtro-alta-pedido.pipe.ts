import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from '../models/producto';

@Pipe({
  name: 'filtroAltaPedido'
})
export class FiltroAltaPedidoPipe implements PipeTransform {

  transform(producto: Producto[], search : string): Producto[] {
    const productosFiltrados = producto.filter(prod => prod.nombre.normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").includes(search));
    return productosFiltrados;
  }

}
