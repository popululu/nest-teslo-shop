import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTable } from '@products/components/product-table/product-table';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Pagination } from "@shared/components/pagination/pagination";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'products-admin',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin.html',
})
export class ProductsAdmin {

  productsService = inject(ProductsService);
  PaginationService = inject(PaginationService)

  productsPerPage = signal(10);

  productsResource = rxResource({
    request: () => ({
      page: this.PaginationService.currentPage(),
      limit: this.productsPerPage() }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: (request.page - 1) * 9,
        limit: request.limit
      });
    },

  });
}



