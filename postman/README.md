# 📮 Postman Collection

Professional API testing collection for the Book Management API.

## 📦 What's Included

- **Complete API Collection** - All endpoints with examples
- **Environment Variables** - Easy switching between environments
- **Automated Tests** - Built-in assertions for each request
- **Realistic Data** - Pre-populated with sample data
- **Error Scenarios** - Examples of 404, 400, 409 errors

---

## 🚀 Quick Start

### 1. Import Collection

**Option A: Using Postman App**
1. Open Postman
2. Click **Import** button
3. Drag and drop `Book-Management-API.postman_collection.json`
4. Click **Import**

**Option B: Using Postman Web**
1. Go to [Postman Web](https://web.postman.co/)
2. Click **Import** → **Upload Files**
3. Select `Book-Management-API.postman_collection.json`

### 2. Import Environment

1. Click **Import** again
2. Import `Local-Development.postman_environment.json`
3. Select **Local Development** environment from dropdown (top right)

### 3. Start Your API

```bash
pnpm run start:dev
```

Make sure the API is running on `http://localhost:3000`

### 4. Run Requests

Click on any request and hit **Send**! 🎉

---

## 📁 Collection Structure

```
Book Management API/
├── 📁 Health & Info
│   ├── GET / (API Info)
│   └── GET /health (Health Check)
│
├── 📁 Authors
│   ├── POST /authors (Create Author)
│   ├── GET /authors?page=1&limit=10 (List with Pagination)
│   ├── GET /authors?search=Orwell (Search by Name)
│   ├── GET /authors/:id (Get Single)
│   ├── PATCH /authors/:id (Update)
│   └── DELETE /authors/:id (Delete)
│
├── 📁 Books
│   ├── POST /books (Create Book)
│   ├── GET /books?page=1&limit=10 (List with Pagination)
│   ├── GET /books?search=Harry (Search by Title)
│   ├── GET /books?authorId={{id}} (Filter by Author)
│   ├── GET /books/:id (Get Single)
│   ├── PATCH /books/:id (Update)
│   └── DELETE /books/:id (Delete)
│
└── 📁 Error Scenarios
    ├── 404 - Author Not Found
    ├── 400 - Validation Error
    ├── 400 - Invalid Author ID
    └── 409 - ISBN Conflict
```

---

## 🎯 Key Features

### ✅ **1. Environment Variables**

The collection uses variables that automatically update:

- `{{baseUrl}}` - API base URL (default: http://localhost:3000)
- `{{authorId}}` - Auto-saved from create author response
- `{{bookId}}` - Auto-saved from create book response

**Usage:**
```
POST {{baseUrl}}/authors
GET  {{baseUrl}}/authors/{{authorId}}
```

### ✅ **2. Automated Tests**

Each request includes test scripts that verify:
- Correct status codes
- Response structure
- Required fields present
- Data types

**Example Test Output:**
```
✓ Status code is 201
✓ Response has author ID
✓ Has timestamps
```

### ✅ **3. Pre-populated Data**

All requests include realistic example data:
- Authors: Ernest Hemingway with full bio
- Books: The Old Man and the Sea with ISBN
- Uses seed data ISBNs for conflict testing

### ✅ **4. Smart Variable Capture**

Create an author → `authorId` automatically saved  
Create a book → `bookId` automatically saved  
Use these IDs in subsequent requests!

---

## 🎬 Recommended Testing Flow

### **Basic Flow (Happy Path)**

1. ✅ **GET /** - Verify API is running
2. ✅ **POST /authors** - Create Ernest Hemingway (saves `authorId`)
3. ✅ **GET /authors/:id** - Retrieve the author you just created
4. ✅ **POST /books** - Create "The Old Man and the Sea" (saves `bookId`)
5. ✅ **GET /books/:id** - Retrieve the book with author info
6. ✅ **PATCH /authors/:id** - Update author bio
7. ✅ **GET /books?authorId={{authorId}}** - Get all books by this author

### **Pagination & Search**

1. ✅ **GET /authors?search=Orwell** - Search for George Orwell (from seed data)
2. ✅ **GET /books?search=Harry Potter** - Search for Harry Potter books
3. ✅ **GET /books?page=1&limit=5** - Paginated results

### **Error Testing**

1. ❌ **404** - Try getting non-existent author
2. ❌ **400** - Create author without required field
3. ❌ **400** - Create book with invalid authorId
4. ❌ **409** - Create book with duplicate ISBN (978-0-452-28423-4)

---

## 🔧 Environment Configuration

### **Switching Environments**

You can create additional environments for different stages:

**Production Environment** (`Production.postman_environment.json`):
```json
{
  "baseUrl": "https://api.yourproduction.com"
}
```

**Staging Environment**:
```json
{
  "baseUrl": "https://staging-api.yourcompany.com"
}
```

Select the environment from the dropdown in the top right corner.

---

## 📊 Running the Entire Collection

### **Collection Runner**

1. Click on the collection name
2. Click **Run** button
3. Select **Local Development** environment
4. Click **Run Book Management API**

**Result:** All requests run in sequence with test results! ✅

### **Newman (CLI)**

Run the collection from command line:

```bash
# Install Newman globally
npm install -g newman

# Run the collection
newman run postman/Book-Management-API.postman_collection.json \
  -e postman/Local-Development.postman_environment.json
```

---

## 🎨 Tips & Best Practices

### **1. Use Seed Data**

The API auto-seeds with 8 authors and 18 books on startup. You can:
- Search for "Orwell", "Rowling", "Tolkien"
- Use ISBN `978-0-452-28423-4` (1984) for conflict testing
- Filter books by seeded author IDs

### **2. Save Examples**

After getting a good response:
1. Click **Save Response** → **Save as Example**
2. Helps document expected responses

### **3. Organize Workspaces**

Create separate workspaces for:
- Development testing
- Integration testing
- Demo/Presentation

### **4. Share with Team**

Export and commit to git:
```bash
git add postman/
git commit -m "docs: add Postman collection"
```

---

## 🐛 Troubleshooting

### **Connection Refused**

**Issue:** `Error: connect ECONNREFUSED 127.0.0.1:3000`

**Solution:**
```bash
# Make sure API is running
pnpm run start:dev
```

### **404 on All Requests**

**Issue:** API not found

**Solution:** Check `baseUrl` in environment:
- Should be `http://localhost:3000` (no trailing slash)

### **authorId or bookId Empty**

**Issue:** Variables not set

**Solution:** 
1. Run **POST /authors** first to set `authorId`
2. Run **POST /books** to set `bookId`
3. Check **Environment** tab to see current values

### **Database Empty After Restart**

**Issue:** In-memory database cleared

**Solution:**
- Database auto-seeds on startup in development mode
- Or manually seed: `pnpm run seed`

---

## 📚 Additional Resources

- **Postman Documentation**: https://learning.postman.com/
- **API Documentation**: See main [README.md](../README.md)
- **Newman CLI**: https://www.npmjs.com/package/newman

---

## 🎉 Happy Testing!

This collection is designed to make testing the Book Management API fast, easy, and professional. All requests include:
- ✅ Proper examples
- ✅ Automated tests
- ✅ Clear descriptions
- ✅ Error scenarios

**Questions?** Check the main README or API documentation.

