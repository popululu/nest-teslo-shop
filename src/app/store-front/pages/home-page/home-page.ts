import { PaginationService } from './../../../shared/components/pagination/pagination.service';
import { ActivatedRoute } from '@angular/router';

import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductCard } from '@products/components/product-card/product-card';
import { ProductsService } from '@products/services/products.service';
import { Pagination } from "@shared/components/pagination/pagination";
// import { map } from 'rxjs';

// import { ProductCardComponent } from '../../../products/components/product-card/product-card.component';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.html',
})
export class HomePage {

  productsService = inject(ProductsService);
  PaginationService = inject(PaginationService)


 /*

 // SIN USAR EL SERVICIO
 ActivatedRoute = inject(ActivatedRoute)

  //toSignal convierte un Observable en una señal y el Observable va ser this.ActivatedRoute.queryParamMap
  // .pipe permite encadenar operadores para transformar, filtrar o manipular datos de un Observable de manera secuencial antes de suscribirse
  // toSignal puedes pasarle inictialvalue si pones cursor encima de currentPage sin initialValue puede devolver undefined asi lo arreglas
  currentPage = toSignal(
    this.ActivatedRoute.queryParamMap.pipe(
      // + convierte de string a number
      // map el observable para devolver solo params.get('page')
      // map Transforma los parametros params que recibo como argumento y voy a regresar los params.get sobre la pagina
      // (params.get('page') page es lo que pusimos en paginacion.html  [queryParams]="{ page: page }"
      // como esto puede ser nulo devuelve 1 sino lo convierte en mumber con +
      // ademas sino es un numero pone otro map
      // toma la pagina y podemos consultar sino es un Numero va ser 1 y sino la pagina
          map((params) => (params.get('page') ? +params.get('page')! : 1)),
          map((page) => (isNaN(page) ? 1 : page))
        ),
        {
          initialValue: 1,
        }
  );

  */

  // peticion http tan pronto ingrese
  // rxResource porque me voy a conectar a un Observable
  // porque el metodo donde llama es un Observalbe getProducts
  //request define una dependencia reactiva (generalmente una Signal o una función que devuelve un valor)
  // que, al cambiar, dispara automáticamente la ejecución de la función loader
  productsResource = rxResource({
    //regresa un objeto vacio

    // sin pagination.service
    // request: () => ({ page: this.currentPage() }),

    //con pagination.service
    request: () => ({ page: this.PaginationService.currentPage() }),
    //lo que queremos mandar a llamar
    loader: ({ request }) => {
      // regresamos el observable que regresa la informacion
      return this.productsService.getProducts({
       // la pagina donde clicas 1,2,3 * 9 porque lo quiero paginar de 9 en 9
        // pero la pagina 1 es la 0 porque sino te hace 1 mas
        /*
          52/9 = 5.7 osea 6 paginas y la ultima no entran 9 productos

          la primera nose tiene que saltar 9 productos entonces por eso a la primera le resto 1
          para que 1-1 = 0 * 9 = 0
          offset
              1 = 0
              2 = 1x9
              3 = 2x9
              4 = 3x9
              5 = 4x9
              6 = 5x9
        */
        // offset: request.page - 1 * 9,
        // limit:1,
        // gender:'women'
        offset: (request.page - 1) * 9,
      });
    },
  });
}
