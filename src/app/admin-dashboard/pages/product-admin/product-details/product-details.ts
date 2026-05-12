import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";
import { FormUtils } from '@utils/formUtils';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';




@Component({
  selector: 'product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  product = input.required<Product>();

  router = inject(Router);
  fb = inject(FormBuilder);

  productsService = inject(ProductsService);
  wasSaved = signal(false);

  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);

  imagesToCarousel = computed(()=> {
    const currentProductImages = [
      ...this.product().images,
      ...this.tempImages(),
    ];
    return currentProductImages;
  })

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    // slug no puede tener espacios, caracteres especiales requiere Exrpes REg
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {

    // product es lo que recivimos como señal

    // this.productForm.reset(this.product())
    // no cuadran los tipos de datos del product con el productForm
    // ejemplo..en el productForm los tags los tenemos com un string y en el product viene como un arreglo
    // puedes poner as any
    // this.productForm.reset(this.product() as any)

    // para arreglarlo
    this.setFormValue(this.product());
  }

  //Partial todos los valores pueden ser opcionales
  setFormValue(formLike: Partial<Product>) {
    //el reset tiene pristine
    this.productForm.reset(this.product() as any);
    //patchValue es similar al reset
    // this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
    // de esta forma los tags son siempre un string
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    // patchValue Permite actualizar solo algunos campos del formulario.
    this.productForm.patchValue({ sizes: currentSizes });
  }



  async onSubmit() {
    const isValid = this.productForm.valid;

    // console.log(this.productForm.value,{isValid});

    //marca todos los elementos
    this.productForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.productForm.value;

    //Partial tiene un producto con todos sus propiedades opcionales
    const productLike: Partial<Product> = {
      //al hacer un ...spred operator pondria todas las propiedades del objeto por separdo
      ...(formValue as any),
      // y asi tenemos accedemos a tags
      // map quita los espacios en blanco
      // map transforma el valor emitido por un Observable en un nuevo valor.
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };
      // console.log(productLike);

      //producto nuevo
      if (this.product().id === 'new') {
        // Crear producto

        // this.productsService.createProduct(productLike).subscribe( product => {
        //   console.log('Producto creado');
        //   this.router.navigate(['/admin/products', product.id]);
        // })

        // firstValueFrom recibe un Observable y regresa una promesa automaticamente hace la subscripcion
        //imageFileList le pasamos las imagenes que tengamos seleccionadas en el carousel
          const product = await firstValueFrom( this.productsService.createProduct(productLike, this.imageFileList) );
          // console.log('Producto creado');
          this.router.navigate(['/admin/products', product.id]);
      } else {
          await firstValueFrom( this.productsService.updateProduct(this.product().id, productLike, this.imageFileList) );
      }

        //mustra una mensaje de que se ha creado
          this.wasSaved.set(true);
          setTimeout(() => {
            this.wasSaved.set(false);
            }, 3000);


      // } else {
      //   // para que se dispare tienes que hacer un subscribe pero para pruebas asi llama al metodo
      //   this.productsService.updateProduct(this.product().id, productLike).subscribe(
      //   product => {
      //     console.log('producto actualizado');
      //   }
      // );


  }

    // Images
    onFilesChanged(event: Event) {
      //fileliste objeto con la lista de elementos
      const fileList = (event.target as HTMLInputElement).files;
      this.imageFileList = fileList ?? undefined;
      // console.log(fileList);
      // this.imageFileList = fileList ?? undefined;
      // filelist es un  objeto "array-like" para recorrerlo lo usamos con array.from..
      //Array.from(filelist) toma ese objeto parecido a un array y lo convierte en una instancia de Array real de JavaScript
      const imageUrls = Array.from(fileList ?? []).map((file) =>
        //URL.createObjectURL crea un url que apunta a un file
        URL.createObjectURL(file)
      );
      // console.log(imageUrls);

      this.tempImages.set(imageUrls);
    }

 }
