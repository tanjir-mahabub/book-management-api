# Book Management API

A RESTful API for managing books and their authors, built with NestJS, TypeScript, and TypeORM.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Choice](#database-choice)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Swagger/OpenAPI](#swaggeropenapi)
- [Postman Collection](#postman-collection)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)

## ✨ Features

- Full CRUD operations for Authors and Books
- Pagination and search functionality
- Comprehensive data validation
- Global exception handling
- Unit and E2E tests
- ISBN validation and uniqueness
- Author-Book relationship management

## 🛠 Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: SQLite (with TypeORM)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI 3.0, Postman
- **Testing**: Jest, Supertest
- **Package Manager**: pnpm
- **Configuration**: @nestjs/config

## 🗄 Database Choice

### Current: SQLite
**Chosen for this challenge because:**
- ✅ Zero configuration required
- ✅ Perfect for development and demos
- ✅ File-based, no separate database server
- ✅ Fully SQL compliant
- ✅ Easy to share and test

### Production Recommendation: PostgreSQL
**Why PostgreSQL for production:**
- ✅ Better concurrency handling
- ✅ Advanced features (JSON, full-text search, etc.)
- ✅ ACID compliant with better transaction support
- ✅ Horizontal scaling options
- ✅ Rich ecosystem and tooling
- ✅ Better performance for complex queries
- ✅ Industry standard for production apps

**Migration Path**: The codebase uses TypeORM, so switching to PostgreSQL only requires changing the database configuration - no code changes needed!

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables (optional)
cp config.env.template .env

# Run in development mode (auto-seeds database with sample data)
pnpm run start:dev

# Build for production
pnpm run build

# Run in production mode
pnpm run start:prod
```

### Database Seeding

The database **automatically seeds with sample data** on first run in development mode:

- **8 Famous Authors** (J.K. Rowling, George Orwell, Jane Austen, etc.)
- **18 Classic Books** (1984, Harry Potter, Pride and Prejudice, etc.)
- All with real ISBNs and publication dates

**Manual Seeding Commands:**
```bash
# Seed database manually
pnpm run seed

# Clear all data
pnpm run seed:clear

# Clear and re-seed
pnpm run seed:clear && pnpm run seed
```

> **Note**: Seeding is idempotent - it won't duplicate data if already seeded.  
> See [Database Seed Documentation](src/database/seed/README.md) for more details.

### Environment Variables

Create a `.env` file in the project root:
```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=db.sqlite
```

See `config.env.template` for all available options.

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authors Endpoints

#### Create Author
```http
POST /authors
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "An accomplished writer...",
  "birthDate": "1980-05-15"
}
```

**Response**: `201 Created`
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "An accomplished writer...",
  "birthDate": "1980-05-15",
  "createdAt": "2025-10-24T...",
  "updatedAt": "2025-10-24T..."
}
```

#### Get All Authors
```http
GET /authors?page=1&limit=10&search=John
```

**Query Parameters**:
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `search` (optional) - Search by firstName or lastName (case-insensitive)

**Response**: `200 OK`
```json
{
  "items": [ /* array of authors */ ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

#### Get Single Author
```http
GET /authors/:id
```

**Response**: `200 OK` or `404 Not Found`

#### Update Author
```http
PATCH /authors/:id
Content-Type: application/json

{
  "bio": "Updated biography"
}
```

**Response**: `200 OK` or `404 Not Found`

#### Delete Author
```http
DELETE /authors/:id
```

**Response**: 
- `204 No Content` - Successfully deleted
- `404 Not Found` - Author doesn't exist
- `400 Bad Request` - Author has associated books

### Books Endpoints

#### Create Book
```http
POST /books
Content-Type: application/json

{
  "title": "The Great Novel",
  "isbn": "978-3-16-148410-0",
  "publishedDate": "2020-01-15",
  "genre": "Fiction",
  "authorId": "uuid-of-author"
}
```

**Response**: `201 Created`
```json
{
  "id": "uuid",
  "title": "The Great Novel",
  "isbn": "978-3-16-148410-0",
  "publishedDate": "2020-01-15",
  "genre": "Fiction",
  "author": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe"
  },
  "createdAt": "2025-10-24T...",
  "updatedAt": "2025-10-24T..."
}
```

**Error Responses**:
- `400 Bad Request` - Invalid authorId or validation failed
- `409 Conflict` - ISBN already exists

#### Get All Books
```http
GET /books?page=1&limit=10&search=Great&authorId=uuid
```

**Query Parameters**:
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `search` (optional) - Search by title or ISBN (case-insensitive)
- `authorId` (optional) - Filter by specific author

**Response**: `200 OK`
```json
{
  "items": [ /* array of books with author info */ ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

#### Get Single Book
```http
GET /books/:id
```

**Response**: `200 OK` or `404 Not Found`

#### Update Book
```http
PATCH /books/:id
Content-Type: application/json

{
  "genre": "Science Fiction"
}
```

**Response**: `200 OK`, `404 Not Found`, or `409 Conflict` (ISBN conflict)

#### Delete Book
```http
DELETE /books/:id
```

**Response**: `204 No Content` or `404 Not Found`

### Error Response Format

All errors follow a consistent format:
```json
{
  "statusCode": 404,
  "timestamp": "2025-10-24T10:30:00.000Z",
  "path": "/authors/invalid-id",
  "message": "Author not found",
  "error": "Not Found"
}
```

## 📖 Swagger/OpenAPI

**Interactive API documentation** is automatically generated and available at:

```
http://localhost:3000/api-docs
```

### Features

- ✅ **Interactive UI** - Try out endpoints directly in your browser
- ✅ **Auto-Generated** - Always in sync with your code
- ✅ **Complete Documentation** - All endpoints, parameters, and schemas
- ✅ **Request/Response Examples** - Realistic sample data
- ✅ **Schema Validation** - See all validation rules
- ✅ **OpenAPI 3.0 Spec** - Export for client SDK generation

### What's Included

**Documented Endpoints:**
- 🏥 Health & Info (2 endpoints)
- 👤 Authors CRUD (5 endpoints)
- 📚 Books CRUD (5 endpoints)

**For Each Endpoint:**
- Summary and detailed description
- Request body schemas with examples
- Query parameter documentation
- Response status codes (200, 201, 204, 400, 404, 409)
- Response schemas
- Error responses

### Quick Start

1. **Start the API**
   ```bash
   pnpm run start:dev
   ```

2. **Open Swagger UI**
   ```
   http://localhost:3000/api-docs
   ```

3. **Try it out!**
   - Click any endpoint
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"
   - See the response!

### Export OpenAPI Spec

Visit:
```
http://localhost:3000/api-docs-json
```

Use the exported JSON for:
- Client SDK generation (TypeScript, Python, Java, etc.)
- API testing tools
- Documentation portals
- Contract testing

### Swagger Tags

Endpoints are organized by:
- `health` - Health check and API info
- `authors` - Author management
- `books` - Book management

## 📮 Postman Collection

**Professional API testing made easy!** A complete Postman collection is included with:

- ✅ **All API Endpoints** - Every endpoint ready to test
- ✅ **Automated Tests** - Built-in assertions for each request
- ✅ **Environment Variables** - Easy configuration management
- ✅ **Realistic Examples** - Pre-populated with sample data
- ✅ **Error Scenarios** - Examples of 404, 400, 409 responses

### Quick Start

1. **Import Collection**
   ```bash
   # Open Postman and import these files:
   postman/Book-Management-API.postman_collection.json
   postman/Local-Development.postman_environment.json
   ```

2. **Select Environment**
   - Choose "Local Development" from the environment dropdown

3. **Start Testing!**
   - Make sure your API is running: `pnpm run start:dev`
   - Click any request and hit **Send**

### What's Included

**Collection Structure:**
- 🏥 Health & Info (2 requests)
- 👤 Authors (7 requests) - Full CRUD + search + pagination
- 📚 Books (7 requests) - Full CRUD + search + filter
- ❌ Error Scenarios (4 requests) - 404, 400, 409 examples

**Features:**
- Auto-saving IDs (`authorId`, `bookId`) for subsequent requests
- Test scripts with assertions on every request
- Pre-configured with seed data for easy testing
- Complete documentation in [`postman/README.md`](postman/README.md)

### Running All Tests

**Using Postman Runner:**
```
Click collection → Run → Select environment → Run all
```

**Using Newman (CLI):**
```bash
npm install -g newman
newman run postman/Book-Management-API.postman_collection.json \
  -e postman/Local-Development.postman_environment.json
```

📖 **Full Documentation**: See [`postman/README.md`](postman/README.md) for detailed usage guide.

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Generate coverage report
pnpm test:cov
```

### Test Coverage
- ✅ AuthorsService (CRUD operations)
- ✅ BooksService (CRUD operations, validations)
- ✅ AuthorsController
- ✅ BooksController
- ✅ AllExceptionsFilter
- ✅ E2E: Create author → Create book → Retrieve book

## 📁 Project Structure

```
src/
├── common/
│   └── filters/
│       └── all-exceptions/         # Global exception handler
├── modules/
│   ├── authors/
│   │   ├── dto/                    # Data Transfer Objects
│   │   ├── entities/               # TypeORM entities
│   │   ├── authors.controller.ts
│   │   ├── authors.service.ts
│   │   ├── authors.module.ts
│   │   └── *.spec.ts              # Unit tests
│   └── books/
│       ├── dto/
│       ├── entities/
│       ├── books.controller.ts
│       ├── books.service.ts
│       ├── books.module.ts
│       └── *.spec.ts
├── app.module.ts
└── main.ts                         # Entry point

test/
└── app.e2e-spec.ts                 # End-to-end tests
```

## 🏗 Design Decisions

### 1. **Module-Based Architecture**
- Each feature (Authors, Books) is a self-contained module
- Promotes separation of concerns and reusability
- Easy to scale and maintain

### 2. **DTOs for Validation**
- Input validation at the API boundary
- Type safety with TypeScript
- Clear contract for API consumers

### 3. **Repository Pattern with TypeORM**
- Clean separation between data access and business logic
- Database-agnostic code
- Easy testing with mocks

### 4. **Global Exception Filter**
- Consistent error responses across the entire API
- Centralized error handling logic
- Special handling for database constraints (unique ISBN)

### 5. **Eager Loading for Book-Author Relation**
- Books always return with author information
- Reduces N+1 query problems
- Better API consumer experience

### 6. **UUID for Primary Keys**
- Better for distributed systems
- No sequential ID enumeration attacks
- Database-agnostic

### 7. **Soft Relations with onDelete: 'RESTRICT'**
- Prevents accidental data loss
- Business rule: Can't delete author with books
- Explicit error message to user

### 8. **Environment Configuration**
- Uses @nestjs/config for centralized configuration
- Type-safe configuration access
- Different settings for development/test/production

## 🔐 Security Considerations

- ✅ Input validation on all endpoints
- ✅ SQL injection protection (TypeORM parameterized queries)
- ✅ UUID instead of sequential IDs
- ✅ Environment-based configuration
- ⚠️ **TODO**: Rate limiting
- ⚠️ **TODO**: Authentication/Authorization
- ⚠️ **TODO**: CORS configuration for production
- ⚠️ **TODO**: Helmet for security headers

## 🚀 Future Improvements

1. **Authentication & Authorization**
   - JWT-based auth
   - Role-based access control (Admin, User)

2. **Advanced Features**
   - Book categories/tags
   - Book reviews and ratings
   - Book borrowing system
   - Full-text search

3. **Performance**
   - Redis caching
   - Database indexing
   - Query optimization

4. **Documentation**
   - ✅ Swagger/OpenAPI integration (COMPLETED)
   - ✅ Postman collection (COMPLETED)

5. **DevOps**
   - Docker containerization
   - CI/CD pipeline
   - Database migrations
   - Monitoring and logging (Winston, Pino)

6. **Testing**
   - Increase coverage to 90%+
   - Performance testing
   - Load testing

## 📝 License

This project is for educational purposes.

## 👥 Author

Built as part of a NestJS coding challenge.

