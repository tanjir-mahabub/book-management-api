import {
  IsString,
  IsOptional,
  IsDateString,
  IsISBN,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'Title of the book',
    example: '1984',
    minLength: 1,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'ISBN-10 or ISBN-13 number',
    example: '978-0-452-28423-4',
    pattern: '^(97(8|9))?\\d{9}(\\d|X)$',
  })
  @IsISBN()
  isbn: string;

  @ApiPropertyOptional({
    description: 'Publication date (ISO 8601 date format)',
    example: '1949-06-08',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @ApiPropertyOptional({
    description: 'Genre or category of the book',
    example: 'Dystopian Fiction',
    enum: [
      'Fiction',
      'Non-Fiction',
      'Science Fiction',
      'Fantasy',
      'Mystery',
      'Thriller',
      'Romance',
      'Horror',
      'Biography',
      'History',
      'Other',
    ],
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({
    description: 'UUID of the author',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  authorId: string;
}
