import { Pipe, PipeTransform } from '@angular/core';
import { Promocion } from '../models/promocion';

@Pipe({
  name: 'filtroPromocion'
})
export class FiltroPromocionPipe implements PipeTransform {

  transform(promocion: Promocion[], page: number=0, search : string): Promocion[] {
    if(search.length=== 0){
      return promocion.slice(page, page+6);
    }
    const sociosFiltrados = promocion.filter(promo=>  promo.nombre.normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").includes(search));
    return sociosFiltrados.slice(page, page+6);
  }

}
