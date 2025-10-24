import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { Author } from '../authors/entities/author.entity';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';

type MockRepo = Partial<Record<keyof Repository<any>, jest.Mock>>;

const createMockRepo = (): MockRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('BooksService', () => {
  let service: BooksService;
  let bookRepo: MockRepo;
  let authorRepo: MockRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: createMockRepo(),
        },
        {
          provide: getRepositoryToken(Author),
          useValue: createMockRepo(),
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookRepo = module.get(getRepositoryToken(Book));
    authorRepo = module.get(getRepositoryToken(Author));
  });

  it('should create a book when author exists', async () => {
    const dto = {
      title: 'X',
      isbn: '978-3-16-148410-0',
      authorId: 'a1',
    } as CreateBookDto;
    const author = { id: 'a1' };
    authorRepo.findOne!.mockResolvedValue(author);
    const created = { id: 'b1', title: 'X', isbn: dto.isbn, author };
    bookRepo.create!.mockReturnValue(created);
    bookRepo.save!.mockResolvedValue(created);

    const res = await service.create(dto);
    expect(res).toEqual(created);
  });

  it('should throw BadRequestException when author not found', async () => {
    authorRepo.findOne!.mockResolvedValue(undefined);
    await expect(
      service.create({
        title: 'X',
        isbn: '978-3-16-148410-0',
        authorId: 'no',
      } as CreateBookDto),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should throw ConflictException when isbn duplicate', async () => {
    const dto = {
      title: 'X',
      isbn: '978-3-16-148410-0',
      authorId: 'a1',
    } as CreateBookDto;
    authorRepo.findOne!.mockResolvedValue({ id: 'a1' });
    bookRepo.create!.mockReturnValue(dto);
    const err = new Error('constraint') as Error & { code: string };
    err.code = 'SQLITE_CONSTRAINT';
    bookRepo.save!.mockRejectedValue(err);

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
  });
});
