import { Pipe, PipeTransform } from '@angular/core';
import { Socio } from '../models/socio';

@Pipe({
  name: 'filtroSocio'
})
export class FiltroSocioPipe implements PipeTransform {

  transform(socios: Socio[], page : number=0, search : string): Socio[] {
    if(search.length=== 0){
      return socios.slice(page, page+6);
    }

    const sociosFiltrados = socios.filter(soc =>soc.dni.toString().includes(search) || soc.apellido.toLowerCase().includes(search));
    return sociosFiltrados.slice(page, page+6);
  }

}
