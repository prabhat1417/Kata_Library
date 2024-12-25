# Library Management System

## Project Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed 

### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:prabhat1417/Kata_Library.git
   cd Kata_Library
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the environment variables:
   ```env
   PORT=3001
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
   ```
   Replace `<username>`, `<password>`, and `<database>` with your MongoDB credentials.

4. Start the server:
   ```bash
   npm start
   ```

5. The server will run on `http://localhost:3001`.

## Running Tests

### Prerequisites
Ensure the test database is set up in your MongoDB cluster and update the `MONGO_URI` in `.env` to point to the test database if needed.

### Running Tests
Run the test suite using:
```bash
npm test
```

### Running Specific Tests
To run tests for specific functionalities (e.g., Add Book):
```bash
npm test -- -t 'Add Book'
```

## Endpoints

### Add Book
- **POST** `/api/addBook`
- **Description**: Adds a new book to the library.
- **Body**:
  ```json
  {
    "isbn": "12345",
    "title": "Test Book",
    "author": "Author A",
    "year": 2023
  }
  ```

### Borrow Book
- **PUT** `/api/borrowBook/:isbn`
- **Description**: Borrows a book using its ISBN.

### Return Book
- **PUT** `/api/returnBook/:isbn`
- **Description**: Returns a book using its ISBN.

### Get all available Books
- **PUT** `/api/availableBooks`
- **Description**: Return all available books.

### Get all Books
- **PUT** `/api/allBooks`
- **Description**: Return all books.

