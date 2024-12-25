const express = require('express');
const libraryController = require('../controllers/libraryController');

const router = express.Router();

router.post('/addBook', libraryController.addBook);

router.put('/borrowBook/:isbn', libraryController.borrowBook);

router.put('/returnBook/:isbn', libraryController.returnBook);

router.get('/availableBooks', libraryController.availableBooks);

module.exports = router;
