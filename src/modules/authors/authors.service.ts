import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author) private authorRepo: Repository<Author>,
    @InjectRepository(Book) private bookRepo: Repository<Book>,
  ) {}

  async create(dto: CreateAuthorDto) {
    const a = this.authorRepo.create(dto);
    return this.authorRepo.save(a);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const qb = this.authorRepo.createQueryBuilder('author');
    if (search) {
      qb.where(
        'LOWER(author.firstName) LIKE :s OR LOWER(author.lastName) LIKE :s',
        {
          s: `%${search.toLowerCase()}%`,
        },
      );
    }
    const skip = (page - 1) * limit;
    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const a = await this.authorRepo.findOne({ where: { id } });
    if (!a) throw new NotFoundException('Author not found');
    return a;
  }

  async update(id: string, dto: UpdateAuthorDto) {
    const a = await this.findOne(id);
    Object.assign(a, dto);
    return this.authorRepo.save(a);
  }

  async remove(id: string) {
    // check books linked to author
    const count = await this.bookRepo.count({ where: { author: { id } } });

    if (count > 0) {
      throw new BadRequestException(
        'Author has associated books. Delete books first.',
      );
    }

    const res = await this.authorRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Author not found');
    return;
  }
}
