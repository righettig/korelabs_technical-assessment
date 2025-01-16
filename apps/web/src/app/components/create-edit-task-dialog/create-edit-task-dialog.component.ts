import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../services/tasks.service';

@Component({
  selector: 'app-create-edit-task-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-edit-task-dialog.component.html',
  styleUrl: './create-edit-task-dialog.component.scss'
})
export class CreateEditTaskDialogComponent {
  @Input() isEditing: boolean = false;
  @Input() task: Task = {
    title: '',
    description: '',
    dueAt: '',
    productId: ''
  };

  @Output() close: EventEmitter<void> = new EventEmitter();
  @Output() save: EventEmitter<Task> = new EventEmitter();

  closeTaskModal(): void {
    this.close.emit();
  }

  saveTask(): void {
    this.save.emit(this.task);
  }
}
