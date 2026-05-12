
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {

  // privadas para que no las malipulen desde fuera
  private _authStatus = signal<AuthStatus>('checking');
  //puede ser de tipo User o nullo por defecto null
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

//se dispara en cuanto se inyecte este servicio llama a checkStatus
  checkStatusResource = rxResource({
    //loader llama al servicio o método HTTP que obtiene la información.
    loader:() => this.checkStatus()
  })


// computed señal de solo lectura
// se dispara cada vez que el authStatus o el user cambie
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);
  // ?? Devuelve el valor de la derecha si el de la izquierda es null o undefine
  isAdmin = computed( () => this._user()?.roles.includes('admin') ?? false)


  /*
   en postman
    localhost:3000/api/auth/login
    y hay que mandarle a traves de post
    {
    "email": "test2@google.com",
    "password": "Abc123"

     a-service para crear el codigo del servicio

    copiamos la respuesta que da el postman y la pegamos en una interface como json as code
        Ctrl+Shif+p
    y tienes que poner un nombre de cabecera AuthResponse
}

  */
//  Regresa un Observable que emite un valor boolean
// si regresa true esta logado
  login(email: string, password: string): Observable<boolean> {
    return this.http
     // va a regresar algo de tipo AuthResponse
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        // tap Dispara efectos secundarios
        // Cuando el Observable emita un valor pasa por todos estos operadores
        tap( resp => {
          this.handleAuthSuccess(resp)
        })
        //hasta aqui no regresa un valor boolean asi que se lo ponemos
        //map transforma el valor emitido por un Observable en un nuevo valor.
        ,map(()=> true),
        // podrias quitar el tap y el map y dejarlo asi
        // map( resp => this.handleAuthSuccess(resp))


        // Si sucede alguna excepcion error o status que no sea 200 entra aqui
        catchError((error: any ) => {
            return this.handleAuthError(error)
        })

      );
  }

  checkStatus():Observable<boolean>{
    const token = localStorage.getItem('token');
    if( !token){
      //sino hay token llama a cerrar sesion
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${ baseUrl }/auth/check-status`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    }).pipe(
      // tap Dispara efectos secundarios
        // Cuando el Observable emita un valor pasa por todos estos operadores
        tap( resp => {
          // this._user.set(resp.user);
          // this._authStatus.set('authenticated');
          // this._token.set(resp.token);

          // localStorage.setItem('token', resp.token)
          this.handleAuthSuccess(resp)
        })
        //hasta aqui no regresa un valor boolean asi que se lo ponemos
        //map transforma el valor emitido por un Observable en un nuevo valor.
        ,map(()=> true),
        // Si sucede alguna excepcion error o status que no sea 200 entra aqui
        catchError((error: any ) => {
            // this._user.set(null);
            // this._token.set(null);
            // this._authStatus.set('not-authenticated');
            // return of( false);
            return this.handleAuthError(error)
        })
    )
  }

  register(email: string, password: string, fullName: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/register`, {
        email: email,
        password: password,
        fullName: fullName,
      })
      .pipe(
        tap( resp => {
          this.handleAuthSuccess(resp)
        })
        ,map(()=> true),
        catchError((error: any ) => {
          return this.handleAuthError(error)
      })
      )
  }


  //Cerrar Sesion
  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');

  }

  private handleAuthSuccess( resp: AuthResponse){
    this._user.set(resp.user);
    this._authStatus.set('authenticated');
    this._token.set(resp.token);

    localStorage.setItem('token', resp.token)

    //podrias quitar el ,map(()=> true), y poner esto
    // return true

  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }



}


