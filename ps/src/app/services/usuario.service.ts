import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadoGenerico } from '../models/resultado-generico';
import { UsuarioLogin } from '../models/usuario-login';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class UsuarioService {

  private recurso : string = 'usuarios';
  private API_URL : string =  `http://localhost:3000/${this.recurso}`;
  constructor(private http : HttpClient) { }

  login(usuario: UsuarioLogin): Observable<ResultadoGenerico> {
    return this.http.post<ResultadoGenerico>(`${this.API_URL}/iniciarSesion`,usuario);
  }
}
