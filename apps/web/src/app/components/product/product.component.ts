import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductsService } from '../../services/products.service';
import { Observable, map } from 'rxjs';
import { AsyncPipe, DatePipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Task, TasksService } from '../../services/tasks.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, KeyValuePipe, ConfirmationDialogComponent, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  product$!: Observable<Product>;

  showConfirmationDialog = false;
  taskToBeDeleted: string | undefined = undefined;

  showCreateTaskModal = false;
  newTask: Task = {
    title: '',
    description: '',
    dueAt: '',
    productId: ''
  };

  constructor(
    private _route: ActivatedRoute,
    private _productsService: ProductsService,
    private _taskService: TasksService,
  ) {}

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    this.loadProduct(id!);
  }

  loadProduct(id: string) {
    this.product$ = this._productsService
      .findAll()
      .pipe(
        map(
          (products: Product[]) =>
            products.find((product) => product.id === id)!,
        ),
      );
  }

  deleteTask(id: string, event: Event) {
    event.stopPropagation();
    this.showConfirmationDialog = true;
    this.taskToBeDeleted = id;
  }

  onDeleteTaskConfirmed() {
    this._taskService
      .delete(this.taskToBeDeleted!)
      .subscribe(() => {
        this.taskToBeDeleted = undefined;
        this.showConfirmationDialog = false;

        const id = this._route.snapshot.paramMap.get('id');
        this.loadProduct(id!);
      })
  }

  onDeleteTaskCancelled() {
    this.taskToBeDeleted = undefined;
    this.showConfirmationDialog = false;
  }

  openCreateTaskModal () {
    this.showCreateTaskModal = true;
  }

  addTask() {
    if (this.product$) {
      this.product$.subscribe(product => {
        product.tasks.push({ ...this.newTask, id: '' });
        
        this._taskService.create({ ...this.newTask, productId: product.id }).subscribe(() => {
          this.closeTaskModal();
        });
      });
    }
  }

  closeTaskModal() {
    this.showCreateTaskModal = false;
  }
}
