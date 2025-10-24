# Database Seeding

This module provides database seeding functionality for development and testing purposes.

## Features

- ✅ **Automatic Seeding**: Auto-seeds on app startup in development mode
- ✅ **Manual Seeding**: CLI commands for manual control
- ✅ **Idempotent**: Won't duplicate data if already seeded
- ✅ **Clear Command**: Reset database to empty state
- ✅ **Realistic Data**: 8 famous authors, 18 classic books with real ISBNs

## Seed Data

### Authors (8)
- George Orwell
- Jane Austen
- J.K. Rowling
- Agatha Christie
- Isaac Asimov
- J.R.R. Tolkien
- Gabriel García Márquez
- Virginia Woolf

### Books (18)
Includes classics like:
- 1984, Animal Farm (Orwell)
- Pride and Prejudice, Emma (Austen)
- Harry Potter series (Rowling)
- Murder on the Orient Express (Christie)
- Foundation, I, Robot (Asimov)
- The Hobbit, The Lord of the Rings (Tolkien)
- One Hundred Years of Solitude (García Márquez)
- Mrs Dalloway, To the Lighthouse (Woolf)

All books include:
- Real ISBNs
- Historical publication dates
- Genre classifications
- Linked to their authors

## Usage

### Automatic Seeding (Development Only)

The database automatically seeds when you start the app in development mode:

```bash
pnpm run start:dev
```

**Output:**
```
[SeedService] Starting database seeding...
[SeedService] Seeding 8 authors...
[SeedService] ✓ Successfully seeded 8 authors
[SeedService] Seeding 18 books...
[SeedService] ✓ Successfully seeded 18 books
[SeedService] ✓ Database seeding completed successfully!
```

If data already exists:
```
[SeedService] Database already contains data (8 authors, 18 books). Skipping seed.
```

### Manual Seeding

Seed the database manually at any time:

```bash
pnpm run seed
```

### Clear Database

Remove all data from the database:

```bash
pnpm run seed:clear
```

Then seed again:
```bash
pnpm run seed
```

## Environment Behavior

| Environment | Auto-Seed on Startup | Manual Seed Available |
|-------------|----------------------|----------------------|
| `development` | ✅ Yes (if empty) | ✅ Yes |
| `production` | ❌ No | ✅ Yes (use with caution) |
| `test` | ❌ No | ✅ Yes |

## Implementation Details

### Architecture

```
src/database/seed/
├── data/
│   ├── authors.data.ts    # Author seed data
│   └── books.data.ts      # Book seed data
├── seed.service.ts        # Core seeding logic
├── seed.module.ts         # NestJS module
├── seed.script.ts         # CLI entry point
└── README.md             # This file
```

### How It Works

1. **Check if data exists** - Counts authors and books
2. **Skip if not empty** - Prevents duplicate data
3. **Seed authors first** - Creates all author records
4. **Seed books** - Creates books linked to authors
5. **Logging** - Clear feedback at each step

### Idempotency

The seeding is idempotent - running it multiple times won't create duplicates:

```typescript
const authorCount = await this.authorRepo.count();
const bookCount = await this.bookRepo.count();

if (authorCount > 0 || bookCount > 0) {
  this.logger.log('Database already contains data. Skipping seed.');
  return;
}
```

## Customization

### Adding More Data

1. **Add authors** in `data/authors.data.ts`:
```typescript
{
  firstName: 'Stephen',
  lastName: 'King',
  bio: 'American author of horror, supernatural fiction...',
  birthDate: '1947-09-21',
}
```

2. **Add books** in `data/books.data.ts`:
```typescript
{
  title: 'The Shining',
  isbn: '978-0-385-12167-5',
  publishedDate: '1977-01-28',
  genre: 'Horror',
  authorLastName: 'King',
}
```

### Modifying Seed Behavior

Edit `seed.service.ts` to change:
- Logging verbosity
- Error handling
- Data validation
- Ordering of operations

## Best Practices

✅ **DO:**
- Use seed data for local development
- Clear and re-seed when schema changes
- Add realistic, diverse data
- Keep seed data in version control

❌ **DON'T:**
- Use seed data in production (create proper migrations instead)
- Commit the SQLite database file (`db.sqlite`)
- Seed with sensitive or personal data
- Rely on seed data for critical tests (use fixtures instead)

## Troubleshooting

### "Database already contains data"
**Solution:** Run `pnpm run seed:clear` first, then `pnpm run seed`

### Foreign key constraint errors
**Solution:** Books are linked to authors by `authorLastName`. Ensure the lastName matches exactly.

### Duplicate ISBN errors
**Solution:** Each ISBN must be unique. Check `books.data.ts` for duplicates.

## Production Considerations

For production databases:
- Use proper **database migrations** (TypeORM migrations)
- Don't rely on auto-sync or seeding
- Use a **migration strategy** for schema changes
- Consider a **data initialization service** for required reference data

---

**Note**: This seeding system is designed for development and demo purposes. Production systems should use TypeORM migrations and proper data management strategies.

