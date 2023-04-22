import { Pipe, PipeTransform } from '@angular/core';
import { DtoPromociones } from '../models/dto-promociones';

@Pipe({
  name: 'filtroCanjeadas'
})
export class FiltroCanjeadasPipe implements PipeTransform {

  transform(promocion: DtoPromociones[], page: number=0): DtoPromociones[] {
    return promocion.slice(page, page+5);
  }

}
