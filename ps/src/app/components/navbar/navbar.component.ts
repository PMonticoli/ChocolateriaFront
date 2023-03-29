import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { SesionIniciadaService } from 'src/app/services/sesion-iniciada.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  sesionIniciada: boolean;
  rol : string;
  private subscription = new Subscription();
  constructor(private servicioUsuario : UsuarioService,
             private servicioSesion : SesionIniciadaService,
             private router : Router){}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getRol();
    this.servicioSesion.sesionCambio().subscribe({
      next : (x : boolean) =>{
        this.getRol();
        this.sesionIniciada=x;
      }
    })
    if (localStorage.getItem('token')) {
      this.servicioSesion.cambiarEstadoSesion(true);
    } else {
      this.servicioSesion.cambiarEstadoSesion(false);
    }
  }


  cerrarSesion() : void{
    Swal.fire({
    title: "Cerrar Sesión", 
    icon: "warning", 
    text: "¿Esta seguro que desea cerrar sesión?",
    showConfirmButton : true,
    showCancelButton: true,
    confirmButtonColor: 'green',
    cancelButtonColor: 'red',
  })
  .then((cerrarSesion) => {
    if (cerrarSesion.isConfirmed) {
      localStorage.removeItem('token');
      this.servicioSesion.cambiarEstadoSesion(false);
      this.router.navigate(['home']);
      Swal.fire({
        title: "Hasta luego,vuelva pronto!",
        icon: "success",
      });
    }
  });
  }

  getRol(){
    this.subscription.add(
      this.servicioUsuario.obtenerRol().subscribe({
        next : (res : ResultadoGenerico)=>{
          if(res.ok && res.resultado && res.resultado.length>0){
            this.rol= res.resultado[0];
          }else{
            this.rol = 'sinIniciarSesion';
            console.log(res);
          }
        },
        error :(err)=>{
          console.log(err);
          this.rol = 'sinIniciarSesion';
        }
      })
    )
  }







}
