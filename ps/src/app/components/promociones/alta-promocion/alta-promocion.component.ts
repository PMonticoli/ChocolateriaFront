import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DetallePromocion } from 'src/app/models/detalle-promocion';
import { Producto } from 'src/app/models/producto';
import { Promocion } from 'src/app/models/promocion';
import { ProductoService } from 'src/app/services/producto.service';
import { PromocionService } from 'src/app/services/promocion.service';

@Component({
  selector: 'app-alta-promocion',
  templateUrl: './alta-promocion.component.html',
  styleUrls: ['./alta-promocion.component.css']
})
export class AltaPromocionComponent implements OnInit, OnDestroy{
formulario : FormGroup;
promocion : Promocion;
productos: Producto[];
detalles: DetallePromocion[] = [];

private subscription = new Subscription();

constructor(private servicioPromocion : PromocionService,
           private servicioProducto : ProductoService,
           private formBuilder : FormBuilder,
           private router: Router){}
  ngOnInit(): void {
    this.formulario= this.formBuilder.group({
      nombre : [,Validators.required],
      descripcion : [],
      precioPuntos : [,Validators.required],
      fechaDesde : [,Validators.required],
      fechaHasta: [,Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get controlNombre() : FormControl{
    return this.formulario.controls['nombre'] as FormControl;
  }

  get controlDescripcion() : FormControl{
    return this.formulario.controls['descripcion'] as FormControl;
  }

  get controlPrecioPuntos() : FormControl{
    return this.formulario.controls['precioPuntos'] as FormControl;
  }

  get controlFechaDesde() : FormControl{
    return this.formulario.controls['fechaDesde'] as FormControl;
  }

  get controlFechaHasta() : FormControl{
    return this.formulario.controls['fechaHasta'] as FormControl;
  }

}
