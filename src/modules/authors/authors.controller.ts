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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly svc: AuthorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new author',
    description: 'Creates a new author with the provided information',
  })
  @ApiBody({ type: CreateAuthorDto })
  @ApiResponse({
    status: 201,
    description: 'Author created successfully',
    type: Author,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed',
  })
  create(@Body() dto: CreateAuthorDto): Promise<Author> {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all authors',
    description:
      'Retrieve a paginated list of authors with optional search by name',
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
    description:
      'Search by firstName or lastName (case-insensitive partial match)',
    example: 'Orwell',
  })
  @ApiResponse({
    status: 200,
    description: 'List of authors retrieved successfully',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ): Promise<{ items: Author[]; total: number; page: number; limit: number }> {
    return this.svc.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get author by ID',
    description: 'Retrieve a single author by their unique ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Author UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Author found',
    type: Author,
  })
  @ApiResponse({
    status: 404,
    description: 'Author not found',
  })
  findOne(@Param('id') id: string): Promise<Author> {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update author',
    description: 'Update an existing author with partial data',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Author UUID',
  })
  @ApiBody({ type: UpdateAuthorDto })
  @ApiResponse({
    status: 200,
    description: 'Author updated successfully',
    type: Author,
  })
  @ApiResponse({
    status: 404,
    description: 'Author not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed',
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAuthorDto,
  ): Promise<Author> {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete author',
    description:
      'Delete an author by ID. Cannot delete if author has associated books.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Author UUID',
  })
  @ApiResponse({
    status: 204,
    description: 'Author deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Author not found',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - Author has associated books. Delete books first.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.svc.remove(id);
  }
}
