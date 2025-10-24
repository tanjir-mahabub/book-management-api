import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../../modules/authors/entities/author.entity';
import { Book } from '../../modules/books/entities/book.entity';
import { seedAuthors } from './data/authors.data';
import { seedBooks } from './data/books.data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Starting database seeding...');

    // Check if already seeded with full dataset
    const authorCount = await this.authorRepo.count();
    const bookCount = await this.bookRepo.count();

    // Consider "fully seeded" if we have most of the expected data
    const expectedAuthors = seedAuthors.length;
    const expectedBooks = seedBooks.length;
    const isFullySeeded =
      authorCount >= expectedAuthors * 0.8 && bookCount >= expectedBooks * 0.8;

    if (isFullySeeded) {
      this.logger.log(
        `Database already contains full seed data (${authorCount} authors, ${bookCount} books). Skipping seed.`,
      );
      return;
    }

    if (authorCount > 0 || bookCount > 0) {
      this.logger.warn(
        `Database contains partial data (${authorCount} authors, ${bookCount} books).`,
      );
      this.logger.warn(
        `Run "pnpm run seed:clear" to clear data before seeding, or seed will be skipped.`,
      );
      return;
    }

    try {
      // Seed authors
      this.logger.log(`Seeding ${seedAuthors.length} authors...`);
      const authors = await this.authorRepo.save(seedAuthors);
      this.logger.log(`✓ Successfully seeded ${authors.length} authors`);

      // Create a map of lastName -> author for easy lookup
      const authorMap = new Map<string, Author>();
      authors.forEach((author) => {
        authorMap.set(author.lastName, author);
      });

      // Seed books
      this.logger.log(`Seeding ${seedBooks.length} books...`);
      const booksToSave = seedBooks
        .map((bookData) => {
          const author = authorMap.get(bookData.authorLastName);
          if (!author) {
            this.logger.warn(
              `Author not found for book "${bookData.title}". Skipping.`,
            );
            return null;
          }

          return this.bookRepo.create({
            title: bookData.title,
            isbn: bookData.isbn,
            publishedDate: bookData.publishedDate,
            genre: bookData.genre,
            author,
          });
        })
        .filter((book) => book !== null);

      const books = await this.bookRepo.save(booksToSave);
      this.logger.log(`✓ Successfully seeded ${books.length} books`);

      this.logger.log('✓ Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('Failed to seed database', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    this.logger.log('Clearing database...');

    try {
      // Delete in correct order (books first due to foreign key)
      const bookCount = await this.bookRepo.count();
      if (bookCount > 0) {
        await this.bookRepo.clear();
        this.logger.log(`✓ Deleted ${bookCount} books`);
      }

      const authorCount = await this.authorRepo.count();
      if (authorCount > 0) {
        await this.authorRepo.clear();
        this.logger.log(`✓ Deleted ${authorCount} authors`);
      }

      this.logger.log('✓ Database cleared successfully!');
    } catch (error) {
      this.logger.error('Failed to clear database', error);
      throw error;
    }
  }
}

