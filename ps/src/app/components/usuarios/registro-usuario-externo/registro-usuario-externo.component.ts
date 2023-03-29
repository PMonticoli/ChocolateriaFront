import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registro-usuario-externo',
  templateUrl: './registro-usuario-externo.component.html',
  styleUrls: ['./registro-usuario-externo.component.css']
})
export class RegistroUsuarioExternoComponent implements OnInit, OnDestroy {
  private subscription : Subscription;
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
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription= new Subscription();
  }

  get controlUsuario(): FormControl {
    return this.formulario.controls['usuario'] as FormControl;
  }

  get controlContrasenia() : FormControl{
    return this.formulario.controls['contrasenia'] as FormControl;
  }
  registrar(){

  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
