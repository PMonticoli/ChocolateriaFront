import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { ProductoService } from 'src/app/services/producto.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.component.html',
  styleUrls: ['./alta-producto.component.css']
})
export class AltaProductoComponent implements OnInit, OnDestroy{
  private subscription = new Subscription();
  formulario : FormGroup;
  isEdit : boolean = false;
  producto : Producto;
  constructor(private servicioProducto : ProductoService,
             private formBuilder : FormBuilder,
             private router : Router,
             private activatedRoute : ActivatedRoute){

this.producto = new Producto();
}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      nombre : [,Validators.required],
      precio : [,Validators.required],
      descripcion : [],
      activo : [],
      observaciones : [],
      disponible : [],
      puntosGanados : [,Validators.required],
      urlImagen : []
    })
    this.cargar();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get controlNombre(): FormControl{
    return this.formulario.controls['nombre'] as FormControl;
  }

  get controlPrecio() : FormControl{
    return this.formulario.controls['precio'] as FormControl;
  }

  get controlPuntos() : FormControl{
    return this.formulario.controls['puntosGanados'] as FormControl;
  }

  cambioActivoCheck(x: boolean){
    this.formulario.patchValue({
      activo : x
    });
  }
  cambioDisponibleCheck(x: boolean){
    this.formulario.patchValue({
      disponible : x
    });
  }

  registrar(){
    if(this.formulario.valid){
      this.producto= this.formulario.value as Producto;
      this.subscription.add(
        this.servicioProducto.agregar(this.producto).subscribe({
          next :(res : ResultadoGenerico)=>{
            if(res.ok){
              Swal.fire({title:'Listo', text:'Registro el producto con exitó', icon: 'success'});
              this.router.navigate(['/producto/listado']);
            }else{
              Swal.fire({title : 'Error', text:'Error al intentar registrar producto', icon: 'error'});
              console.log(res.mensaje);
            }
          },
          error : (err)=>{
            Swal.fire({title:'Error', text:`Error al registrar producto`, icon: 'error'});
            console.error(err);
          }
        })
      )
    }
  }


  editar(){
    let body = this.formulario.value as Producto;
    body.id=this.producto.id;
    this.subscription.add(
      this.servicioProducto.modificar(body).subscribe({
        next : (res : ResultadoGenerico) =>{
          if(res.ok){
            Swal.fire({title:'Listo!', text:`Se editó el producto correctamente`, icon: 'success'});
            this.router.navigate(['/producto/listado']);
          }else{
            Swal.fire({title:'Error!', text:`${res.mensaje}`, icon: 'error'});
          }
        },
        error: (e) => { 
          Swal.fire({title:'Error!', text:`Error al editar producto`, icon: 'error'});
          console.error(e);
        }
      })
    )
  }

  
  cargar () : void{
    this.subscription.add(
      this.activatedRoute.params.subscribe(
        e=>{
          let id = e['id'];
          if(id){
            this.isEdit=true;
            this.subscription.add(
              this.servicioProducto.getProductoById(id).subscribe({
                next : (res : ResultadoGenerico) =>{
                  if(res.ok && res.resultado){
                    this.producto=res.resultado[0];
                    this.formulario.patchValue(this.producto);
                  }else{
                    Swal.fire({title:'Error!', text:`${res.mensaje}`, icon: 'error'});               
                  }
                },
                error : (err) =>{
                  Swal.fire({title:'Atención!', text:`No posee los permisos necesarios para acceder a este recurso`, icon: 'warning'});
                  console.log(err);
                }
              }
            )
          )}else{
            this.isEdit=false;
          }
        }
      ) 
    )
  }
}
