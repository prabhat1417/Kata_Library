const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Book = require('../src/models/Book'); 

describe('Library Management - Add Book', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  // to clear test data after every tests
  afterEach(async () => {
    await Book.deleteOne({ isbn: '12345' });
  });

  afterAll(async () => {
    await mongoose.disconnect(); 
  });

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
