import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PaginationService {
  private ActivatedRoute = inject(ActivatedRoute)

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

}
