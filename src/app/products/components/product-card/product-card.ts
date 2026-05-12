import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { productImagePipe } from '@products/pipe/product-image.pipe';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, productImagePipe],
  templateUrl: './product-card.html',
})
export class ProductCard {

  //recibimos el producto requerido y es de tipo Product
  product = input.required<Product>()

  imageUrl = computed(() => {
    return `http://localhost:3000/api/files/product/${ this.product().images[0] }`;
  })
 }
