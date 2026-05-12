

import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
})
export class LoginPage {

  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router)

  authService = inject(AuthService)

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }
    const { email='', password=''  } = this.loginForm.value;
    // console.log({ email, password  });
    //Sin poner el map y el catherror en el servicio
    // this.authService.login(email!, password!).subscribe(resp => {
    //   console.log(resp);
    // })


    //como ahora el Observable devuelve un boolean ponemos isAuthenticated en vez de resp
    this.authService.login(email!, password!).subscribe(isAuthenticated => {
       if ( isAuthenticated ){
          ///Redirige a otra pagina porque ya esta logado
          // / es el home
          this.router.navigateByUrl('/')
          return
       }

       //este tambien esta en un if en el .html que se muestra o no si hay error
       this.hasError.set(true);
       setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
    })

    //Check Authentication

    // Registro

    // Logout


    //si mandas el token en el postman
    // localhost:3000/api/auth/check-status

    // "email": "test1@google.com",
    // "password": "Abc123"

    // localhost:3000/api/auth/check-status
    // por get
    // poniendo el break token
  }


}
