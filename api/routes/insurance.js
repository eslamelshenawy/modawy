// NPM Packages
const express = require('express');
const router = express.Router();
const insurances = require('../controllers/insurance');
const checkAuth = require('../middleware/check-auth');

// Create a new Note
router.post('/', checkAuth, insurances.create);

// Retrieve all Notes
router.get('/', insurances.findAll);

// Retrieve a single Note with specialisteId
router.get('/:insuranceId', insurances.findOne);

// Update a Note with specialisteId
router.put('/:insuranceId', checkAuth, insurances.update);

// Delete a Note with specialisteId
router.delete('/:insuranceId', checkAuth, insurances.delete);

module.exports = router;