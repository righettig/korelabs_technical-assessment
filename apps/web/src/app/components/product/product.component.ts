import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductsService } from '../../services/products.service';
import { Observable, map, switchMap } from 'rxjs';
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

  showTaskModal = false;
  newTask: Task = {
    title: '',
    description: '',
    dueAt: '',
    productId: ''
  };

  isEditing: boolean = false;

  taskIndex: number | null = null;

  constructor(
    private _route: ActivatedRoute,
    private _productsService: ProductsService,
    private _taskService: TasksService,
  ) { }

  ngOnInit(): void {
    this.reloadCurrentProduct();
  }

  loadProduct(id: string) {
    this.product$ = this._productsService.findOne(id);
  }

  deleteTask(id: string, event: Event) {
    event.stopPropagation();
    this.showConfirmationDialog = true;
    this.taskToBeDeleted = id;
  }

  onDeleteTaskConfirmed(): void {
    if (this.taskToBeDeleted) {
      this._taskService.delete(this.taskToBeDeleted).subscribe(() => {
        this.resetConfirmationDialog();
        this.reloadCurrentProduct();
      });
    }
  }

  onDeleteTaskCancelled(): void {
    this.resetConfirmationDialog();
  }

  openTaskModal(task: Task | null = null, index: number | null = null, event?: Event): void {
    event?.stopPropagation();
    this.isEditing = !!task;
    this.taskIndex = index;
    this.newTask = task ? { ...task } : this.createEmptyTask();
    this.showTaskModal = true;
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.taskIndex = null;
    this.newTask = this.createEmptyTask();
  }

  saveTask(): void {
    this.product$?.pipe(
      switchMap(product => {
        const taskOperation = this.isEditing && this.taskIndex !== null
          ? this._taskService.update(this.newTask)
          : this._taskService.create({ ...this.newTask, productId: product.id });
          
        return taskOperation.pipe(
          map(() => this.reloadCurrentProduct())
        );
      })
    ).subscribe(() => this.closeTaskModal());
  }

  private createEmptyTask(): Task {
    return { title: '', description: '', dueAt: '', productId: '' };
  }

  private resetConfirmationDialog(): void {
    this.showConfirmationDialog = false;
    this.taskToBeDeleted = undefined;
  }

  private reloadCurrentProduct(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) this.loadProduct(id);
  }
}
