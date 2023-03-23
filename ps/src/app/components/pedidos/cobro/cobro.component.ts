import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { TipoPago } from 'src/app/models/tipo-pago';
import { CobroService } from 'src/app/services/cobro.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { TipoPagoService } from 'src/app/services/tipo-pago.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-cobro',
  templateUrl: './cobro.component.html',
  styleUrls: ['./cobro.component.css']
})
export class CobroComponent implements OnInit,OnDestroy {
private subscription : Subscription;
private formulario : FormGroup;
tiposPago : TipoPago[];
cobraConTarjeta: boolean;
mostrarCodQr: boolean = false;
labelBoton: string;
@Input() abonaCliente: boolean;
@Input() disabled: boolean;
@Input() pedido: any;
@Output() onCobrado = new EventEmitter();
detalles: DetallePedido[];
montoTotal: number = 0;


constructor(private servicioPedido : PedidoService,
           private servicioCobro : CobroService,
           private servicioTipoPago : TipoPagoService,
           private formBuilder : FormBuilder){}

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.formulario = this.formBuilder.group({
      tiposPago : [,Validators.required],
      codigoAutorizacion : [,Validators.required]
    })

    this.formulario.controls["tipoPago"].valueChanges.subscribe(x => {
      if(x.nombre == 'Tarjeta de Débito' || x.nombre == 'Tarjeta de Crédito') {
        this.formulario.controls['codigoAutorizacion'].setValidators([Validators.required]);
        this.cobraConTarjeta = true;
        this.mostrarCodQr = false;
      } else if (x.nombre == 'Mercado Pago') {
        this.formulario.controls['codigoAutorizacion'].clearValidators();
        this.cobraConTarjeta = false;
        this.mostrarCodQr = true;
      } else {
        this.formulario.controls['codigoAutorizacion'].clearValidators();
        this.cobraConTarjeta = false;
        this.mostrarCodQr = false;
      }
      this.formulario.controls['codigoAutorizacion'].reset();
      this.formulario.controls['codigoAutorizacion'].updateValueAndValidity();
   })

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  obtenerTiposPago(): void {
    this.subscription.add(
      this.servicioTipoPago.obtenerTodos().subscribe({
        next: (r: ResultadoGenerico)=> {
          if(r.ok && r.resultado){
            if (this.abonaCliente){
              this.tiposPago = r.resultado.filter(x => {return x.nombre == 'Mercado Pago'});
            } else {
              this.tiposPago = r.resultado as TipoPago[];
            }
          } else {
            console.error(r.mensaje);
          }
        },
        error: (e) => {
          console.error(e);
        }
      })
    )
  }
  
  calcularTotal(): void {
    let total = 0;
    this.detalles.forEach(x => {
      total = total + x.precioUnitario * x.cantidad;
    });
    this.montoTotal = total;
  }

  obtenerDetalles(): void {
    if(!this.pedido.id){
      console.error("Pedido id no definido");
      return;
    }
    this.subscription.add(
      this.servicioPedido.obtenerDetalles(this.pedido.id).subscribe({
        next: (r: ResultadoGenerico) => {
          if(r.ok){
            this.detalles = r.resultado? r.resultado : [];
            this.calcularTotal();
          }
          else {
            console.error(r.mensaje);
          }
        },
        error: (e) => {
          console.error(e);
        }
      })
    )
  }

  
  guardarCobro(): void {
    if(this.formulario.valid) {
      const { tipoPago, codigoAutorizacion } = this.formulario.value;
      const reqbody = {
        idPedido: this.pedido.id,
        tipoPago: tipoPago, 
        codigoAutorizacion: codigoAutorizacion, 
        montoCobrado: this.montoTotal
      }
      this.subscription.add(
        this.servicioCobro.agregar(reqbody).subscribe({
          next: (r: ResultadoGenerico) => {
            if(r.ok){
              this.onCobrado.emit();
              const condicion = this.abonaCliente ? 'Pago' : 'Cobro';
              Swal.fire({ title: 'Éxito!', text:  condicion + ' '+ 'realizado con éxito.', icon: 'success' });
            } else {
              console.error(r.mensaje);
            }

          },
          error: (e) => {
            Swal.fire({ title: 'Error!', text: 'Se produjo un error', icon: 'error' });
          }
        })
      )
    } else {
      Swal.fire({ title: 'Error!', text: 'Se produjo un error', icon: 'error' });
    }
  }
  get controlTipoPago(): FormControl {
    return this.formulario.controls['tipoPago'] as FormControl;
  }
  get controlCodAutorizacion(): FormControl {
    return this.formulario.controls['codigoAutorizacion'] as FormControl;
  }

}
