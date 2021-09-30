const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    anonymousFlag: {
        type: Boolean,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);