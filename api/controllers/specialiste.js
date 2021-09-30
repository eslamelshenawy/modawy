const Specialiste = require('../models/specialiste');
const mongoose = require('mongoose');

// Create and Save a new Specialiste
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        return res.status(400).send({
            message: "Specialiste content can not be empty"
        });
    }
    console.log('Save a new Specialiste:' + req.body.name);
    // Create a Specialiste
    const specialiste = new Specialiste({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        name_ar: req.body.name_ar,
        parent_id:req.body.parent_id
    });

    // Save Specialiste in the database
    specialiste.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Specialiste."
            });
        });
};

// Retrieve and return all specialistes from the database.
exports.findAll = (req, res) => {
    console.log('here findAll!!---------->speacial');
    Specialiste.find().then(specialistes => {
            res.send(specialistes);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving specialistes."
            });
        });
};


// Retrieve and return all specialistes from the database.
exports.findAllParents = (req, res) => {
    console.log('here findAllParents!!---------->speacial');
    Specialiste.find(
        {"parent_id":null}
    )
        .then(specialistes => {
            res.send(specialistes);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving specialistes."
            });
        });
};

// Find a single specialiste with a specialisteId
exports.findOne = (req, res) => {
    Specialiste.findById(req.params.specialisteId)
        .then(specialiste => {
            if (!specialiste) {
                return res.status(404).send({
                    message: "Specialiste not found with id " + req.params.specialisteId
                });
            }
            res.send(specialiste);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Specialiste not found with id " + req.params.specialisteId
                });
            }
            return res.status(500).send({
                message: "Error retrieving specialiste with id " + req.params.specialisteId
            });
        });
};

// Update a specialiste identified by the specialisteId in the request
exports.update = (req, res) => {
    console.log('here update!!---------->speacial');
    // Validate Request
    if (!req.body.name) {
        return res.status(400).send({
            message: "Specialiste content can not be empty"
        });
    }
    console.log("REFFF",req.body);
    // Find specialiste and update it with the request body
    Specialiste.findByIdAndUpdate(req.params.specialisteId, {
        name: req.body.name ,
        name_ar: req.body.name_ar ,
        parent_id: req.body.parent_id
        }, {
            new: true
        })
        .then(specialiste => {
            if (!specialiste) {
                return res.status(404).send({
                    message: "Specialiste not found with id " + req.params.specialisteId
                });
            }
            res.send(specialiste);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Specialiste not found with id " + req.params.specialisteId
                });
            }
            return res.status(500).send({
                message: "Error updating specialiste with id " + req.params.specialisteId
            });
        });
};

// Delete a specialiste with the specified specialisteId in the request
exports.delete = (req, res) => {
    Specialiste.findByIdAndRemove(req.params.specialisteId)
        .then(specialiste => {
            if (!specialiste) {
                return res.status(404).send({
                    message: "Specialiste not found with id " + req.params.specialisteId
                });
            }
            res.send({
                message: "Specialiste deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Specialiste not found with id " + req.params.specialisteId
                });
            }
            return res.status(500).send({
                message: "Could not delete specialiste with id " + req.params.specialisteId
            });
        });
};