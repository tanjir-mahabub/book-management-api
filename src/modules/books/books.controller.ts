import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly svc: BooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new book',
    description:
      'Creates a new book linked to an author. Returns the book with author information.',
  })
  @ApiBody({ type: CreateBookDto })
  @ApiResponse({
    status: 201,
    description: 'Book created successfully',
    type: Book,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid authorId or validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - ISBN already exists',
  })
  create(@Body() dto: CreateBookDto): Promise<Book> {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all books',
    description:
      'Retrieve a paginated list of books with optional search and filtering',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by title or ISBN (case-insensitive partial match)',
    example: 'Harry Potter',
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    type: String,
    description: 'Filter books by author UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of books retrieved successfully with author info',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('authorId') authorId?: string,
  ): Promise<{ items: Book[]; total: number; page: number; limit: number }> {
    return this.svc.findAll(page, limit, search, authorId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get book by ID',
    description:
      'Retrieve a single book by ID with full author information included',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Book UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Book found with author information',
    type: Book,
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  findOne(@Param('id') id: string): Promise<Book> {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update book',
    description: 'Update an existing book with partial data',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Book UUID',
  })
  @ApiBody({ type: UpdateBookDto })
  @ApiResponse({
    status: 200,
    description: 'Book updated successfully',
    type: Book,
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - ISBN already exists',
  })
  update(@Param('id') id: string, @Body() dto: UpdateBookDto): Promise<Book> {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete book',
    description: 'Delete a book by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Book UUID',
  })
  @ApiResponse({
    status: 204,
    description: 'Book deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.svc.remove(id);
  }
}
