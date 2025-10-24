import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksController', () => {
  let controller: BooksController;

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call BooksService.create with dto and return result', async () => {
      const dto = {
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        authorId: 'a1',
      } as CreateBookDto;

      const result = { id: 'b1', ...dto };
      mockBooksService.create.mockResolvedValue(result);

      const res = await controller.create(dto);
      expect(res).toEqual(result);
      expect(mockBooksService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call BooksService.findAll with pagination and search params', async () => {
      const mockRes = { items: [], total: 0, page: 1, limit: 10 };
      mockBooksService.findAll.mockResolvedValue(mockRes);

      const res = await controller.findAll(1, 10, 'test', 'auth1');
      expect(res).toEqual(mockRes);
      expect(mockBooksService.findAll).toHaveBeenCalledWith(
        1,
        10,
        'test',
        'auth1',
      );
    });
  });

  describe('findOne', () => {
    it('should call BooksService.findOne and return book', async () => {
      const mockBook = { id: 'b1', title: 'Book' };
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const res = await controller.findOne('b1');
      expect(res).toEqual(mockBook);
      expect(mockBooksService.findOne).toHaveBeenCalledWith('b1');
    });
  });

  describe('update', () => {
    it('should call BooksService.update with id and dto', async () => {
      const dto: UpdateBookDto = { title: 'Updated' };
      const updated = { id: 'b1', title: 'Updated' };
      mockBooksService.update.mockResolvedValue(updated);

      const res = await controller.update('b1', dto);
      expect(res).toEqual(updated);
      expect(mockBooksService.update).toHaveBeenCalledWith('b1', dto);
    });
  });

  describe('remove', () => {
    it('should call BooksService.remove with id', async () => {
      mockBooksService.remove.mockResolvedValue(undefined);

      await controller.remove('b1');
      expect(mockBooksService.remove).toHaveBeenCalledWith('b1');
    });
  });
});
