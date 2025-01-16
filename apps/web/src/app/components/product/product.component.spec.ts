import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent } from './product.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { TasksService } from '../../services/tasks.service';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let mockTasksService: jasmine.SpyObj<TasksService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            if (key === 'id') {
              return '123'; // Mocked id value
            }
            return null;
          }
        }
      }
    } as ActivatedRoute;

    mockProductsService = jasmine.createSpyObj('ProductsService', ['findAll']);
    mockProductsService.findAll.and.returnValue(of([])); // Mock findAll method to return an empty observable

    mockTasksService = jasmine.createSpyObj('TasksService', ['delete', 'update', 'create']);

    await TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: TasksService, useValue: mockTasksService },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
