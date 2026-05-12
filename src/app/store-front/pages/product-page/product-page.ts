import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
})
export class ProductPage  implements OnInit  {

  // si queremos tomar la ruta activa tenemos que inyectar algo
  activatedRouted = inject(ActivatedRoute)

  //accedemos al servicio
  productService = inject(ProductsService)

  // productIdSlug: string = '';
  productIdSlug: string = this.activatedRouted.snapshot.params['idSlug'];
  // esto da lo mismo que lo de abajo con un observable women_chill_half_zip_cropped_hoodie
  // http://localhost:4200/product/women_chill_half_zip_cropped_hoodie


  // el argumento esta en los routes.ts y viene asi:
  //   path: 'product/:idSlug',

  ngOnInit() {
    // Se ejecuta al inicializar el componente
    // snapshot porque dice que no necesito que sea reactivo,
    // porque esta es unica es el detalle de un producto, voy a tener que salir de la pantalla y hacer clic en otra
    // this.productIdSlug = this.activatedRouted.snapshot.params['idSlug'];
    // console.log( this.productIdSlug);
  }


  // console.log(productIdSlug);

    // productIdSlug =

  // rxResource
  // peticion http tan pronto ingrese
  // rxResource porque me voy a conectar a un Observable
  // porque el metodo donde llama es un Observalbe getProductByIdSlug
    productResource = rxResource({
      //lo que yo quiero asignarle al loader
      request: () => ({ idSlug: this.productIdSlug }),
      loader: ({ request }) => {
        return this.productService.getProductByIdSlug(request.idSlug)
      }

    });


 //Ruta activa  query = inject(ActivatedRoute)
  // params parametros que vienen en el url
  // estamos en la misma ruta pero cambian los parametros
  //si pones cursos encima de params ves que es observable
  // query = inject(ActivatedRoute).params.subscribe(
  //   (params) => {
  //     // idSlug sale del nombre que hay puesto en store-front.routes path: 'product/:idSlug',
  //     console.log(params['idSlug']);
  //   }
  // )

 }
