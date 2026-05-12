import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage'
})

export class productImagePipe implements PipeTransform {

  //recibimos un string o un string como un arreglo
  transform(value: null | string | string[], ...args: any[]): any {

      if ( value === null ){
        return './assets/images/placeholder/no-image.jpg';
      }

      //para las imagenes de agregar examinar en el details...
      if (typeof value === 'string' && value.startsWith('blob:')) {
        // console.log(value);
        //devuelve el value sin ponerle toda la base/files/product....
        return value;
      }

      //si es de tipo string es una unica imagen
      if (typeof value === 'string') {
        return `${baseUrl}/files/product/${value}`;
      }
      // sino es un string es un array porque recibo solo string o array
      // value.at(0) tambien funciona
       // sino viene nada devuelve undefined
      const image = value[0];

      // console.log(image);

      //y sino viene nada...le pone la imagen de nada
      if (!image) {
        return './assets/images/placeholder/no-image.jpg';
      }

      // si tiene imagen, regresa esa imagen
      return `${baseUrl}/files/product/${image}`;
    }
}

