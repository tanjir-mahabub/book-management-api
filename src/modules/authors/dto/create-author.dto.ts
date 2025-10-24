import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({
    description: 'First name of the author',
    example: 'George',
    minLength: 1,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the author',
    example: 'Orwell',
    minLength: 1,
  })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    description: 'Biography of the author',
    example:
      'English novelist, essayist, journalist and critic. Known for his works 1984 and Animal Farm.',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Birth date of the author (ISO 8601 date format)',
    example: '1903-06-25',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}