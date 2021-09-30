const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

// Create and Save a new Feedback
exports.create = (req, res) => {
    // Validate request
    if (!req.body.email) {
        return res.status(400).send({
            message: "Email content can not be empty"
        });
    }
    if (!req.body.type_feedback) {
        return res.status(400).send({
            message: "Feedback Type content can not be empty"
        });
    }
    console.log('Save a new Feedback:' + req.body.type_feedback);
    // Create a Feedback
    const feedback = new Feedback({
        _id: new mongoose.Types.ObjectId(),
        feedback: req.body.feedback,
        email: req.body.email,
        type_feedback: req.body.type_feedback
    });

    // Save Feedback in the database
    feedback.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the feedback."
            });
        });
};

// Retrieve and return all feedback from the database.
exports.findAll = (req, res) => {
    console.log('here findAll!!------>feedback');
    Feedback.find()
        .populate('doctorInfo.networkInsurances')
        .then(feedbackes => {
            res.send(feedbackes);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving feedbackes."
            });
        });
};