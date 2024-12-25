const express = require('express');
const libraryController = require('../controllers/libraryController');

const router = express.Router();

router.post('/addBook', libraryController.addBook);

module.exports = router;
