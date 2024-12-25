const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Book = require('../src/models/Book'); 

describe('Library Management', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  // to clear test data after every tests
  const allBooks = ['12345','12346','12347']
  afterEach(async () => {
    await Book.deleteMany({ isbn: { $in: allBooks } });
  });

  afterAll(async () => {
    await mongoose.disconnect(); 
  });

  describe('Add Book', () => {
  test('should add a book successfully', async () => {
    const bookData = {
      isbn: '12345',
      title: 'Test Book',
      author: 'Author A',
      year: 2023,
    };

    const response = await request(app).post('/api/addBook').send(bookData);

    expect(response.status).toBe(201);
    expect(response.body.book).toHaveProperty('isbn', '12345');
    expect(response.body.book).toHaveProperty('title', 'Test Book');
  });

  test('should fail to add a book with missing required fields', async () => {
    const incompleteBookData = {
      title: 'Test Book',
    };

    const response = await request(app).post('/api/addBook').send(incompleteBookData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Missing required fields');
    expect(response.body.missingFields).toContain('isbn');
    expect(response.body.missingFields).toContain('author');
    expect(response.body.missingFields).toContain('year');
  });

  test('should fail to add a book with same isbn', async () => {
    const bookData = {
        isbn: '12345',
        title: 'Test Book',
        author: 'Author A',
        year: 2023,
      };

    await request(app).post('/api/addBook').send(bookData);
    const response = await request(app).post('/api/addBook').send(bookData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'An error occurred');
  });
  });

  describe('Borrow Book', () => {
    test('should borrow a book successfully', async () => {
      const book = new Book({
        isbn: '12345',
        title: 'Test Book',
        author: 'Author A',
        year: 2023,
        isAvailable: true,
      });
      await book.save();

      const response = await request(app).put(`/api/borrowBook/${book.isbn}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Book borrowed successfully');
      expect(response.body.book).toHaveProperty('isbn', '12345');
      expect(response.body.book.isAvailable).toBe(false);

      const updatedBook = await Book.findOne({ isbn: '12345' });
      expect(updatedBook.isAvailable).toBe(false);
    });

    test('should fail to borrow a book that is not available', async () => {
      const book = new Book({
        isbn: '12345',
        title: 'Test Book',
        author: 'Author A',
        year: 2023,
        isAvailable: false,
      });
      await book.save();

      const response = await request(app).put(`/api/borrowBook/${book.isbn}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Book not available');

      const unchangedBook = await Book.findOne({ isbn: '12345' });
      expect(unchangedBook.isAvailable).toBe(false);
    });

    test('should return 404 if book with given ISBN does not exist', async () => {
      const response = await request(app).put('/api/borrowBook/99999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Book not available');
    });
  });

  describe('Return Book', () => {
    test('should return a book successfully', async () => {
      const book = new Book({
        isbn: '12345',
        title: 'Test Book',
        author: 'Author A',
        year: 2023,
        isAvailable: false,
      });
      await book.save();

      const response = await request(app).put(`/api/returnBook/${book.isbn}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Book returned successfully');
      expect(response.body.book).toHaveProperty('isbn', '12345');
      expect(response.body.book.isAvailable).toBe(true);

      const updatedBook = await Book.findOne({ isbn: '12345' });
      expect(updatedBook.isAvailable).toBe(true);
    });

    test('should fail to return a book that is available', async () => {
      const book = new Book({
        isbn: '12345',
        title: 'Test Book',
        author: 'Author A',
        year: 2023,
        isAvailable: true,
      });
      await book.save();

      const response = await request(app).put(`/api/returnBook/${book.isbn}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Book already available');

      const unchangedBook = await Book.findOne({ isbn: '12345' });
      expect(unchangedBook.isAvailable).toBe(true);
    });

    test('should return 404 if book with given ISBN does not exist', async () => {
      const response = await request(app).put('/api/returnBook/99999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'No book exist with this ISBN');
    });
  });

  describe('View Available Books', () => {
    beforeEach(async () => {
      const books = [
        {
          isbn: '12345',
          title: 'Test Book 1',
          author: 'Author A',
          year: 2022,
          isAvailable: true,
        },
        {
          isbn: '12346',
          title: 'Test Book 2',
          author: 'Author B',
          year: 2023,
          isAvailable: true,
        },
        {
          isbn: '12347',
          title: 'Test Book 3',
          author: 'Author C',
          year: 2021,
          isAvailable: false,
        },
      ];
      await Book.insertMany(books);
    });
  
    test('should return all available books', async () => {
      const response = await request(app).get('/api/availableBooks');
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('books');
      expect(response.body.books.length).toBe(2);
  
      const titles = response.body.books.map((book) => book.title);
      expect(titles).toContain('Test Book 1');
      expect(titles).toContain('Test Book 2');
    });
  
  });

});
