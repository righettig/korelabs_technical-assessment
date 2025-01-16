import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { of } from 'rxjs';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  
  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', ['findAll', 'delete']);
    mockProductsService.findAll.and.returnValue(of([])); // Mock findAll method to return an empty observable
    mockRouter = jasmine.createSpyObj('Router', ['navigate']); // Mock navigate method

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
