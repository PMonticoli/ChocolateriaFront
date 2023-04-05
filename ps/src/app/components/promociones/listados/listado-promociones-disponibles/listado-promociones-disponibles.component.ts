import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromocionService } from 'src/app/services/promocion.service';

@Component({
  selector: 'app-listado-promociones-disponibles',
  templateUrl: './listado-promociones-disponibles.component.html',
  styleUrls: ['./listado-promociones-disponibles.component.css']
})
export class ListadoPromocionesDisponiblesComponent implements OnInit,OnDestroy{
  @Input() listado : any[]= [];
  private subscription = new Subscription();
  page : number = 0;
  search : string ='';
  constructor(private servicioPromocion : PromocionService) { }

  ngOnInit(): void {
    this.cargarTabla();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarTabla(){

  }

  onSearchProduct(buscar : string){
    this.page=0;
    this.search=buscar.toLowerCase().normalize('NFD').toLowerCase()
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1");
  }

  prevPage(){
    if(this.page>0){
      this.page-=6;
    }
  }

  nextPage(){
    this.page+=6;
  }
}
