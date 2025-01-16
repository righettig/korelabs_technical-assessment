import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditTaskDialogComponent } from './create-edit-task-dialog.component';

describe('CreateEditTaskDialogComponent', () => {
  let component: CreateEditTaskDialogComponent;
  let fixture: ComponentFixture<CreateEditTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditTaskDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
