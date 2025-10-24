import {
  IsString,
  IsOptional,
  IsDateString,
  IsISBN,
  IsUUID,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsISBN()
  isbn: string;

  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsUUID()
  authorId: string;
}
