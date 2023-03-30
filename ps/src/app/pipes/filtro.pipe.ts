import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from '../models/producto';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(producto: Producto[], page : number= 0, search : string): Producto[] {
    if(search.length=== 0){
      return producto.slice(page, page+6);
    } 

    const productosFiltrados = producto.filter(prod => prod.nombre.toLowerCase().includes(search));
    return productosFiltrados.slice(page, page+6);
  }

}
