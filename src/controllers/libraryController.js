const Book = require('../models/Book');

// Function to add a book
async function addBook(req, res) {
  try {
    const requiredFields = ["isbn", "title", "author", "year"];
    const missingFields = [];

    for (const field of requiredFields) {
      if (req.body[field] === undefined) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields: missingFields,
      });
    }

    const book = new Book(req.body);
    await book.save();

    res.status(201).json({
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
}

//Function to borrow a book
async function borrowBook(req, res) {
  try {
    const isbn = req.params.isbn;

    const book = await Book.findOne({ isbn });

    if(!book || (book.isAvailable === false)){
        return res.status(404).json({
          message: "Book not available"
        });
    }

    book.isAvailable = false;
    await book.save();

    res.status(200).json({
      message: "Book borrowed successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
}

//Function to return a book
async function returnBook(req, res) {
  try {
    const isbn = req.params.isbn;

    const book = await Book.findOne({ isbn });

    if(!book){
        return res.status(404).json({
          message: "No book exist with this ISBN"
        });
    }

    if(book.isAvailable){
        return res.status(404).json({
          message: "Book already available"
        });
    }

    book.isAvailable = true;
    await book.save();

    res.status(200).json({
      message: "Book returned successfully",
      book,
    });
  }catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
}

//Function to return available books
async function availableBooks(req, res) {
  try {
    const books = await Book.find({ isAvailable: true }).lean();

    res.status(200).json({
        books
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
}

//Function to return all books
async function allBooks(req, res) {
    try {
      const books = await Book.find().lean();
  
      res.status(200).json({
          books
      });
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  }

module.exports = {
  addBook,
  borrowBook,
  returnBook,
  availableBooks,
  allBooks
};
