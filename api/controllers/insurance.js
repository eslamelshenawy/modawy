const Insurance = require('../models/insurance');
const mongoose = require('mongoose');

// Create and Save a new Insurance
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        return res.status(400).send({
            message: "Insurance content can not be empty"
        });
    }
    console.log('Save a new Insurance:' + req.body.name);
    // Create a Insurance
    const insurance = new Insurance({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        name_ar: req.body.name_ar
    });

    // Save Insurance in the database
    insurance.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the insurance."
            });
        });
};

// Retrieve and return all insurances from the database.
exports.findAll = (req, res) => {
    console.log('here findAll!!------>insurance');
    Insurance.find()
    .populate('doctorInfo.networkInsurances')
        .then(insurances => {
            res.send(insurances);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving insurances."
            });
        });
};

// Find a single insurance with a insuranceId
exports.findOne = (req, res) => {
    Insurance.findById(req.params.insuranceId)
        .then(insurance => {
            if (!insurance) {
                return res.status(404).send({
                    message: "insurance not found with id " + req.params.insuranceId
                });
            }
            res.send(insurance);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "insurance not found with id " + req.params.insuranceId
                });
            }
            return res.status(500).send({
                message: "Error retrieving insurance with id " + req.params.insuranceId
            });
        });
};

// Update a insurance identified by the insuranceId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.name) {
        return res.status(400).send({
            message: "insurance content can not be empty"
        });
    }

    // Find insurance and update it with the request body
    Insurance.findByIdAndUpdate(req.params.insuranceId, {
        name: req.body.name ,
        name_ar: req.body.name_ar ,
        }, {
            new: true
        })
        .then(insurance => {
            if (!insurance) {
                return res.status(404).send({
                    message: "insurance not found with id " + req.params.insuranceId
                });
            }
            res.send(insurance);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "insurance not found with id " + req.params.insuranceId
                });
            }
            return res.status(500).send({
                message: "Error updating insurance with id " + req.params.insuranceId
            });
        });
};

// Delete a insurance with the insurance insuranceId in the request
exports.delete = (req, res) => {
    Insurance.findByIdAndRemove(req.params.insuranceId)
        .then(insurance => {
            if (!insurance) {
                return res.status(404).send({
                    message: "insurance not found with id " + req.params.insuranceId
                });
            }
            res.send({
                message: "insurance deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "insurance not found with id " + req.params.insuranceId
                });
            }
            return res.status(500).send({
                message: "Could not delete insurance with id " + req.params.insuranceId
            });
        });
};