import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResultadoGenerico } from 'src/app/models/resultado-generico';
import { UsuarioLogin } from 'src/app/models/usuario-login';
import { UsuarioService } from 'src/app/services/usuario.service';
const Swal = require('sweetalert2');
@Component({
  selector: 'app-recuperar-clave',
  templateUrl: './recuperar-clave.component.html',
  styleUrls: ['./recuperar-clave.component.css']
})
export class RecuperarClaveComponent {
  private subscription = new Subscription();
  formulario: FormGroup;
  fieldTextType: boolean;

  constructor(
    private servicioUsuario: UsuarioService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.formulario = this.formBuilder.group({
      usuario : [,Validators.required],
      contrasenia : [,Validators.required]
    })
  }
  get controlUsuario(): FormControl {
    return this.formulario.controls['usuario'] as FormControl;
  }

  get controlContrasenia() : FormControl{
    return this.formulario.controls['contrasenia'] as FormControl;
  }

  recuperarClave(): void {
    if (this.formulario.valid) {
      let usuarioLogin = new UsuarioLogin();
      usuarioLogin = this.formulario.value as UsuarioLogin;
      this.subscription.add(
        this.servicioUsuario.modificarClave(usuarioLogin).subscribe({
          next: (res: ResultadoGenerico) => {
            if (res.mensaje === 'Contraseña actualizada correctamente') {
              Swal.fire({ title: 'Actualizaste la contraseña con éxito!', icon: 'success' });
              this.router.navigate(['home']);
            } else {
              Swal.fire({ title: 'Error', text: res.mensaje, icon: 'error' });
            }
          },
          error: (err) => {
            Swal.fire({ title: 'Error al actualizar contraseña', text: `${err.message}`, icon: 'error' });
          }
        })
      );
    } else {
      Swal.fire({ title: 'Atención', text: 'Complete los campos por favor', icon: 'warning' });
    }
  }
  
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
