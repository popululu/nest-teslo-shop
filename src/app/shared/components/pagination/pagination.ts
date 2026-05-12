import { AfterViewInit, Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [ RouterLink],
  templateUrl: './pagination.html',
})
// implements AfterViewInit
export class Pagination {
  //cuantas paginas son
  pages = input(0);
  currentPage = input<number>(1);

  // cuando tienes una señal que se inicializa con algo que puede cambiar desde el input
  // se usa linkedSignal para que trabaje siempre con esta y no con la otra
  activePage = linkedSignal(this.currentPage);

  // crea un valor de solo lectura que se calcula automáticamente basándose en otras señales
  // se actuualiza automáticamente solo cuando sus dependencias cambian
  getPagesList = computed(() => {
    //Crea un Array basado en el length: this.pages(), inicializa los valores, indice y regresa indice + 1
    // Crear un array de longitud n secuencial
    return Array.from( { length: this.pages() }, (_, i) => i + 1)
  })

  // ngAfterViewInit() {
  //   console.log(console.log( Array.from( { length: this.pages() }, (_, i) => i + 1) ));
  // }
}
