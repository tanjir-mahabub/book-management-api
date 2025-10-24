import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('App (e2e)', () => {
  let app: INestApplication;
  let httpServer: ReturnType<INestApplication['getHttpServer']>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    httpServer = app.getHttpServer();

    // Grab TypeORM DataSource to optionally clear DB after tests
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    // Close app and destroy DB connection
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  it('POST /authors -> POST /books -> GET /books/:id', async () => {
    // 1) create author
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createAuthorRes = await request(httpServer)
      .post('/authors')
      .send({ firstName: 'E2E', lastName: 'Tester' })
      .expect(201);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const authorId = createAuthorRes.body.id;
    expect(authorId).toBeDefined();

    // 2) create book using authorId
    const bookPayload = {
      title: 'E2E Book',
      isbn: '978-1-4028-9462-6',
      publishedDate: '2020-01-01',
      genre: 'Test',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      authorId: authorId,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createBookRes = await request(httpServer)
      .post('/books')
      .send(bookPayload)
      .expect(201);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const bookId = createBookRes.body.id;
    expect(bookId).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(createBookRes.body.author).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(createBookRes.body.author.id).toBe(authorId);

    // 3) get book by id and assert
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const getBookRes = await request(httpServer)
      .get(`/books/${bookId}`)
      .expect(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(getBookRes.body.id).toBe(bookId);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(getBookRes.body.title).toBe(bookPayload.title);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(getBookRes.body.author.id).toBe(authorId);
  });
});
