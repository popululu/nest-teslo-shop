import { ActivatedRoute, Router } from '@angular/router';
import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductsService } from '@products/services/products.service';
import { ProductDetails } from './product-details/product-details';

@Component({
  selector: 'product-admin',
  imports: [ProductDetails],
  templateUrl: './product-admin.html',
})
export class ProductAdmin {

  //Si el id que ingresa no existe le mandamos a otro sitio
  activatedRoute = inject(ActivatedRoute)
  //Redireccion
  router = inject(Router)

  productService= inject(ProductsService)

  // producto como una señal para cambiarlo
  //toSignal convierte un Observable de RxJS en una Señal (Signal)
  productId = toSignal(
    this.activatedRoute.params.pipe(
      // map transforma el valor emitido por un Observable en un nuevo valor.
      // tomo con el map los params y regreso el id
      map((params) => params['id'])
    )
  )

  //para traer la data
  productResource = rxResource({
    request: () => ({ id: this.productId() }),
    loader: ({ request }) => {
      return this.productService.getProductById(request.id);
    },
  });

  // sino encuentra el id da error 404
  // se dispara automáticamente cuando cambian los Signals que se leen dentro de su función. Se ejecuta al menos una vez tras su creación
  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  });

 }
