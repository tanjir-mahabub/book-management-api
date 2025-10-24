import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';
import { Book } from '../books/entities/book.entity';
import { CreateAuthorDto } from './dto/create-author.dto';

type MockRepo = Partial<Record<keyof Repository<any>, jest.Mock>>;

const createMockRepo = (): MockRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
});

describe('AuthorsService', () => {
  let service: AuthorsService;
  let authorRepo: MockRepo;
  let bookRepo: MockRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        { provide: getRepositoryToken(Author), useValue: createMockRepo() },
        { provide: getRepositoryToken(Book), useValue: createMockRepo() },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    authorRepo = module.get(getRepositoryToken(Author));
    bookRepo = module.get(getRepositoryToken(Book));
  });

  it('should create an author', async () => {
    const dto: CreateAuthorDto = { firstName: 'John', lastName: 'Doe' };
    const saved = { id: '1', ...dto };
    authorRepo.create!.mockReturnValue(saved);
    authorRepo.save!.mockResolvedValue(saved);

    const res = await service.create(dto);
    expect(res).toEqual(saved);
    expect(authorRepo.save).toHaveBeenCalledWith(saved);
  });

  it('should block deletion if author has books', async () => {
    bookRepo.count!.mockResolvedValue(2);
    await expect(service.remove('1')).rejects.toThrow();
  });

  it('should delete author when no books', async () => {
    bookRepo.count!.mockResolvedValue(0);
    authorRepo.delete!.mockResolvedValue({ affected: 1 });
    await expect(service.remove('1')).resolves.toBeUndefined();
  });
});
