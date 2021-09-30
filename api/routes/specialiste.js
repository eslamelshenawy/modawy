// NPM Packages
const express = require('express');
const router = express.Router();
const specialistes = require('../controllers/specialiste');
const checkAuth = require('../middleware/check-auth');

// Create a new Note
router.post('/', checkAuth, specialistes.create);

// Retrieve all Notes
router.get('/', specialistes.findAll);

router.get('/findAllParents/', specialistes.findAllParents);


// Retrieve a single Note with specialisteId
router.get('/:specialisteId', specialistes.findOne);

// Update a Note with specialisteId
router.put('/:specialisteId',  specialistes.update);

// Delete a Note with specialisteId
router.delete('/:specialisteId', checkAuth, specialistes.delete);

module.exports = router;