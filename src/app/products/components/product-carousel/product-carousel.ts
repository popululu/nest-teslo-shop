import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { productImagePipe } from '@products/pipe/product-image.pipe';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';



@Component({
  selector: 'product-carousel',
  imports: [productImagePipe],
  templateUrl: './product-carousel.html',
  styles: `
    .swiper {
      width: 100%;
      height: 500px;
    }
  `,
})
export class ProductCarousel implements AfterViewInit, OnChanges  {

  images = input.required<string[]>();
  // viewChild es un decorador que permite acceder desde la clase TypeScript (componente padre)
  // a elementos del DOM
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  swiper: Swiper | undefined = undefined;

  // Estar pendientes del input y reiciar el swiperinit

  //Cuando un input cambia se dispara
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'].firstChange) {
      return;
    }
    // this.swiperInit()

    if (!this.swiper) return;

    this.swiper.destroy(true, true);
    // this.swiperInit()

    //accede a los puntos del carousel
    const paginationEl: HTMLDivElement =
    this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');

    console.log(paginationEl);

    paginationEl.innerHTML = '';

    //si lo hace sin esto osea mas deprisa no funciona bien y nosalen los puntos al instante
    // al esperar un poco lo renderiza mejor y salen bien
    setTimeout(() => {
        this.swiperInit();
      }, 100);


    }


  ngAfterViewInit(): void {
    this.swiperInit();
  }

  swiperInit() {
    // console.log(this.images);
    const element = this.swiperDiv().nativeElement;
    if (!element) return;

    // console.log(element);
    // const swiper = new Swiper(element, {
    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      // te pone las flechas y los puntos de navegacion
      modules: [Navigation, Pagination],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
  });
  }

 }
