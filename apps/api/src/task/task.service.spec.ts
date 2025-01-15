import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Product } from '../product/entities/product.entity';

describe('TaskService', () => {
    let service: TaskService;
    let taskRepository: Repository<Task>;
    let productRepository: Repository<Product>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskService,
                {
                    provide: getRepositoryToken(Task),
                    useClass: Repository, // Mock Repository for Task
                },
                {
                    provide: getRepositoryToken(Product),
                    useClass: Repository, // Mock Repository for Product
                },
            ],
        }).compile();

        service = module.get<TaskService>(TaskService);
        taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
        productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // @fixme add tests for service crud actions
});