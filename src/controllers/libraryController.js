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

module.exports = {
  addBook
};
