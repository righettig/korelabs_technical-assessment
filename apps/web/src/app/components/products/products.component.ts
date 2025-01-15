import { Component, OnInit } from '@angular/core';
import { Product, ProductsService } from '../../services/products.service';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, DatePipe, ConfirmationDialogComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  products$!: Observable<Product[]>;
  
  showConfirmationDialog = false;
  productToBeDeleted: string | undefined = undefined;

  constructor(
    private _service: ProductsService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.products$ = this._service.findAll();
  }

  showProduct(id: string) {
    this._router.navigate(['products', id]);
  }

  deleteProduct(id: string, event: Event) {
    event.stopPropagation();
    this.showConfirmationDialog = true;
    this.productToBeDeleted = id;
  }

  onDeleteProductConfirmed() {
    this._service
      .delete(this.productToBeDeleted!)
      .subscribe(() => {
        this.productToBeDeleted = undefined;
        this.showConfirmationDialog = false;

        this.loadProducts();
      })
  }

  onDeleteProductCancelled() {
    this.productToBeDeleted = undefined;
    this.showConfirmationDialog = false;
  }
}
