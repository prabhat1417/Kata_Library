const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookID : { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
});

const Book = mongoose.model('Books', bookSchema);

module.exports = Book;
