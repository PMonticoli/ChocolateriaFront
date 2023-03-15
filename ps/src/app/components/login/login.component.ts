import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { UsuarioLogin } from 'src/app/models/usuario-login';
import { SesionIniciadaService } from 'src/app/services/sesion-iniciada.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private subscription = new Subscription();
  formulario: FormGroup;

  constructor(
    private servicioUsuario: UsuarioService,
    private formBuilder: FormBuilder,
    private servicioSesion : SesionIniciadaService,
    private router: Router
  ) {
    this.formulario = this.formBuilder.group({
      usuario : [,Validators.required],
      contrasenia : [,Validators.required]
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {}

  get controlUsuario(): FormControl {
    return this.formulario.controls['usuario'] as FormControl;
  }

  get controlContrasenia() : FormControl{
    return this.formulario.controls['contrasenia'] as FormControl;
  }

  iniciarSesion(): void {

    // if (this.formulario.valid) {
    //   let usuarioLogin = new UsuarioLogin();
    //   usuarioLogin = this.formulario.value as UsuarioLogin;
    //   this.subscription.add(
    //     this.servicioUsuario.login(usuarioLogin).subscribe({
    //       next: (res: ResultadoGenerico) => {
    //         if (res.ok && res.resultado != null) {
    //           localStorage.setItem('token',res.resultado[0]);
    //           swal({title:'Bienvenido/a!', icon:'success'});
    //           this.servicioSesion.cambiarEstadoSesion(true);
    //           this.router.navigate(['home']);
    //         } else {
    //           swal({title:'Error', text:`${res.mensaje}`, icon: 'error'})
    //         }
    //       },
    //       error: (err) => { swal({title:'Error al iniciar sesión', text: `${err.message}`, icon: 'error'}); }
    //     })
    //   );
    // }
    // else {
    //   swal({title:'Atención', text: 'Complete los campos por favor', icon: 'warning'});
    // }
  }
}
