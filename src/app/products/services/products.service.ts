import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
}


@Injectable({providedIn: 'root'})

export class ProductsService {

  private http = inject(HttpClient);

  //Cache
  /*
    new map es una estructura de datos nativa que almacena pares clave-valor, permitiendo usar
    cualquier tipo de dato (objetos, funciones, primitivos) como clave

    set(clave, valor) para añadir
    para recuperar, has(clave)

    // 2. Añadir pares clave-valor (set)
        usuarios.set('a1', { nombre: 'Ana' });
        usuarios.set('b2', { nombre: 'Pedro' });

    // 3. Obtener valor (get)
         console.log(usuarios.get('a1')); // { nombre: 'Ana' }

    // 4. Verificar existencia (has)
          if (usuarios.has('b2')) {
            console.log('Usuario encontrado');
          }
*/
/*
para almacenar el cache tengo que saber el limit offset y gender, que sera la key
y si la llave la tengo guardada regreso ese cache que sera un Objeto de tipo ProductsResponse  */
//la llave es tipo string y el valor resultante o lo que va almacenar es de tipo ProductsResponse
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  // Regresa un Observable que emite el productResponse
  getProducts(options: Options): Observable<ProductsResponse> {

    const { limit = 9, offset = 0, gender = '' } = options;

    // se ve mejor en chrome
    console.log(this.productsCache.entries());

    //9-0-kids
    const key = `${limit}-${offset}-${gender}`;


    if ( this.productsCache.has(key )){
      //regresa el listado de productos, todo el objeto de tipo ProductsResponse que se ha guardado la primera vez que hace la peticion http
      // Object { count: 18, pages: 2, products: (9) […] }
      // ahi se guardan las rutas de imagenes, textos etc...
      // of convierte argumentos (datos, objetos, variables) en un Observable
      return of (this.productsCache.get(key)!)
      /* return of({
      //el ProductsResponse tiene
          count:52,
          pages: 6,
          products: []
      }) */
    }

    return this.http
      //al hacer la peticion http me regresa algo de tipo ProductsResponse
      // .get<ProductsResponse>(`http://localhost:3000/api/products`)
      // .pipe(tap((resp) => console.log(resp)));

      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          // es lo mismo que poner limit: limit,
          limit,
          offset,
          gender,
        },
      })
      .pipe(
          tap((resp) => console.log(resp)),
          //el resp mete el objeto con la respouesta de las rutas imagnes textos y todo
          // Object { count: 18, pages: 2, products: (9) […] }
          tap((resp) => this.productsCache.set(key, resp)),

        );
      //offset la cantidad de registros que quieres altarte al inicio
      //limit=9&offset18 llegando al item 18 quiero los sigientes limit 9
      //offset cuantos quieres que se salte
      //&gender=
      // 1 se salta 0
      // 2 salta 9
      // 3 salta 18
  }


  //recibes el id de tipo string y regresas un Observable que resuelve un producto
  getProductByIdSlug(idSlug: string): Observable<Product> {
    //chill_pullover_hoodie
    const key = `${idSlug}`;

    if ( this.productCache.has(key )){
      return of (this.productCache.get(key)!)
    }

    return this.http
          .get<Product>(`${baseUrl}/products/${idSlug}`)
          .pipe(
            //si hace el http le pongo un delay de 2 segundos para ver
            // que si tarda es que ha entrado aqui sino lo coge de cache
            delay(2000),
            tap((producto) => this.productCache.set(key, producto)),
          );
  }

  getProductById(id: string): Observable<Product> {
    // si da al boton crear nuevo
    if (id === 'new') {
      return of(emptyProduct);
    }

  //   if (this.productCache.has(id)) {
  //     return of(this.productCache.get(id)!);
  //   }

  //   return this.http
  //     .get<Product>(`${baseUrl}/products/${id}`)
  //     .pipe(tap((product) => this.productCache.set(id, product)));
  // }
  const key = `${id}`;

    if ( this.productCache.has(key )){
      return of (this.productCache.get(key)!)
    }

    return this.http
          .get<Product>(`${baseUrl}/products/${id}`)
          .pipe(
            tap((producto) => this.productCache.set(key, producto)),
          );
  }

  updateProduct( id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {


    const currentImages = productLike.images ?? [];

    //switchMap Encadenamiento de observables...cuando ser termine ejecutar el siguiente...y asi
    //Cargar las imagenes y se empiezan a subir
    return this.uploadImages(imageFileList)
      .pipe(
        //map imageNames seria el resultado de imageFileList y transforma imageNames en un nuevo Objeto
        map((imageNames) => ({
          ...productLike,
          images: [...currentImages, ...imageNames],
        })),
        // switchMap genera otro observable basado en el resultado anterior
        switchMap((updatedProduct) =>
          this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
        ),
        tap((product) => this.updateProductCache(product))
      );

      // return this.http
      //   .patch<Product>(`${baseUrl}/products/${id}`, productLike)
      //   .pipe(tap((product) => this.updateProductCache(product)));


     // console.log('Actualizando producto');
    // return this.http
    //   .patch<Product>(`${baseUrl}/products/${id}`, productLike)
    //   //tap efecto secundario
    //   .pipe(tap((product) => this.updateProductCache(product)));
  }

  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    // return this.http
    //   .post<Product>(`${baseUrl}/products`, productLike)
    //   .pipe(tap((product) => this.updateProductCache(product)));

    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      // Disparamos la carga de las imágenes
      map((imagesNames) => {
        return { ...productLike, images: [...currentImages, ...imagesNames] };
      }),
      // Si todo sale bien hacemos la petición http
      switchMap((createdProduct) => {
        return this.http.post<Product>(`${baseUrl}/products/`, createdProduct);
      }),
      // Actualizamos la cache
      tap((product) => {
        return this.updateProductCache(product);
      }),
    );

  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach((productResponse) => {
      //Recorro los que ya tengo con el id que me estan pasando
      // si es el mismo id que estoy leyendo con el que me pasan
      // regreso el producto pasado sino no hago nada
      //map regresa un nuevo Array
      productResponse.products = productResponse.products.map(
        (currentProduct) => {
          return currentProduct.id === productId ? product : currentProduct
        }
      );
    });
    console.log('Caché actualizado');
  }

  //Toma un fileList y lo sube un grupo de imagenes
  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    //barre todas las imagenes y crea un observable para cada imagen
    const uploadObservables = Array.from(images).map((imageFile) =>
      //llama al metodo uploadImage
      this.uploadImage(imageFile)
    );

    // espera que todos los observables se emitan de manera exitosa
    // forkJoin ejecuta múltiples Observables en paralelo y espera a que todos se completen para emitir un único valor
    return forkJoin(uploadObservables).pipe(
      //efectos secundarios (side-effects) sin modificar los datos
      tap((imageNames) => console.log({ imageNames }))
    );
  }

  //Sube una sola imagen
  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http
      .post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      //map transforma los datos emitidos por un Observable
      .pipe(map((resp) => resp.fileName));
  }


}
