import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Author } from '../authors/entities/author.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private bookRepo: Repository<Book>,
    @InjectRepository(Author) private authorRepo: Repository<Author>,
  ) {}

  async create(dto: CreateBookDto) {
    const author = await this.authorRepo.findOne({
      where: { id: dto.authorId },
    });
    if (!author) throw new BadRequestException('Author not found');

    const book = this.bookRepo.create({
      title: dto.title,
      isbn: dto.isbn,
      publishedDate: dto.publishedDate,
      genre: dto.genre,
      author,
    });

    try {
      return await this.bookRepo.save(book);
    } catch (err) {
      // sqlite: SQLITE_CONSTRAINT, Postgres: 23505
      const code = (err as { code?: string }).code;
      if (code === 'SQLITE_CONSTRAINT' || code === '23505') {
        throw new ConflictException('ISBN already exists');
      }
      throw err;
    }
  }

  async findAll(page = 1, limit = 10, search?: string, authorId?: string) {
    const qb = this.bookRepo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author');
    if (search) {
      qb.where('LOWER(book.title) LIKE :s OR LOWER(book.isbn) LIKE :s', {
        s: `%${search.toLowerCase()}%`,
      });
    }
    if (authorId) {
      if (search) qb.andWhere('book.authorId = :authorId', { authorId });
      else qb.where('book.authorId = :authorId', { authorId });
    }
    const skip = (page - 1) * limit;
    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const book = await this.bookRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    Object.assign(book, dto);
    try {
      return await this.bookRepo.save(book);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === 'SQLITE_CONSTRAINT' || code === '23505') {
        throw new ConflictException('ISBN already exists');
      }
      throw err;
    }
  }

  async remove(id: string) {
    const res = await this.bookRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Book not found');
    return;
  }
}
