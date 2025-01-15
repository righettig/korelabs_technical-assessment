import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Product } from '../product/entities/product.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';

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
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOneBy: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Product),
                    useValue: {
                        save: jest.fn(),
                        find: jest.fn(),
                        findOneBy: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
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

    describe('create', () => {
        it('should call taskRepository.save with the createTaskDto and set the product when product is found', async () => {
            const createTaskDto: CreateTaskDto = {
                title: 'task title',
                description: 'task description',
                dueAt: '2025-01-15T12:30:00Z',
                productId: '1'
            };

            // mock 'create'
            const createdAt = new Date();
            const dueAt = new Date(createTaskDto.dueAt);

            jest.spyOn(taskRepository, 'create').mockReturnValue({
                ...createTaskDto,
                id: undefined,
                product: undefined,
                createdAt,
                dueAt
            });

            // mock 'findOneBy'
            const product = { id: '1' } as Product;
            jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(product);

            await service.create(createTaskDto);

            expect(taskRepository.save).toHaveBeenCalledWith({
                ...createTaskDto,
                product: { id: '1' },
                id: undefined,
                createdAt,
                dueAt
            });
        });

        it('should throw an Error when product is NOT found', async () => {
            const createTaskDto: CreateTaskDto = {
                title: 'task title',
                description: 'task description',
                dueAt: '2025-01-15T12:30:00Z',
                productId: '1'
            };

            // mock 'create'
            const createdAt = new Date();
            const dueAt = new Date(createTaskDto.dueAt);

            jest.spyOn(taskRepository, 'create').mockReturnValue({
                ...createTaskDto,
                id: undefined,
                product: undefined,
                createdAt,
                dueAt
            });

            // mock 'findOneBy'
            jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(undefined);

            await expect(service.create(createTaskDto)).rejects.toThrow('Product with ID 1 not found');
        });
    });

    describe('findAll', () => {
        it('should call taskRepository.find', () => {
            service.findAll();
            expect(taskRepository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should call taskRepository.findOneBy with the id', () => {
            const id = '123';
            service.findOne(id);
            expect(taskRepository.findOneBy).toHaveBeenCalledWith({ id });
        });
    });

    describe('update', () => {
        it('should call taskRepository.save with the updated task', () => {
            const id = '123';
            const updateTaskDto: UpdateTaskDto = {
                description: 'test task - updated'
            };
            service.update(id, updateTaskDto);
            expect(taskRepository.save).toHaveBeenCalledWith({ ...updateTaskDto, id });
        });
    });

    describe('remove', () => {
        it('should call taskRepository.delete with the id', () => {
            const id = '123';
            service.remove(id);
            expect(taskRepository.delete).toHaveBeenCalledWith({ id });
        });
    });
});