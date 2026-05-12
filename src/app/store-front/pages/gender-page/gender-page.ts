import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCard } from "@products/components/product-card/product-card";
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Pagination } from '@shared/components/pagination/pagination';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, Pagination],
  templateUrl: './gender-page.html',
})
export class GenderPage {

  //reaccionar cuando cambie el url de men women kids
//  puede ser una señal reactiva o un observable
// reaccionar cuando eso cambie

// navego entre mujeres hombres y niños dentro de la misma pagina
// sin embargo en la que muestra las fotos de un producto tienes que ir atras para volver a cambiar la pagina
// de esta forma usas snapshot de la otra no puedes

// si queremos tomar la ruta activa tenemos que inyectar algo
route = inject(ActivatedRoute)
productsService = inject(ProductsService);

PaginationService = inject(PaginationService)
// datos: any;

//toSignal convierte un Observable de RxJS en una Señal (Signal)
//convierte la ruta route en una señal para poder usar rxResource

// para poder acceder desde el html aqui lo convierte en una señal
// no se subscribe porque es mejor hacerlo asi
// Si te suscribes, debes desuscribirte en ngOnDestroy()
// .pipe directamente gestiona automáticamente la desuscripción

// this.route.params es un Observable,
// lo que significa que emite un nuevo valor cada vez que los parámetros de la ruta cambian
// . El método .pipe() te permite encadenar operadores para procesar esos cambios
//  antes de que lleguen al componente

gender = toSignal(
  this.route.params.pipe(
    //map transforma el valor emitido por un Observable en un nuevo valor.
    map(({ gender }) => gender)
  )
)

//otra forma con subscribe
  /* route2 = inject(ActivatedRoute).params.subscribe(
    (params) => {
      // console.log(params['gender']);
      this.datos = params['gender']
    }
  )
 */



  // peticion http tan pronto ingrese
  // rxResource porque me voy a conectar a un Observable
  // porque el metodo donde llama es un Observalbe getProducts
  productsResource = rxResource({
    // request reacciona a cambios en un parametro ejecutando loader sin subcribirse
    // estar pendientes cuando el gender cambie
    // request Define la dependencia reactiva

    //Sin paginacion
    // request: () => ({ gender: this.gender() }),

    //con paginacion
    request: () => ({ gender: this.gender(), page: this.PaginationService.currentPage() }),
    //lo que queremos mandar a llamar
    loader: ({ request }) => {
      // regresamos el observable que regresa la informacion
      return this.productsService.getProducts({
        // limit:1,
        gender:request.gender,
        //con paginacion
        offset: (request.page - 1) * 9,
      });
    },
  });

}
