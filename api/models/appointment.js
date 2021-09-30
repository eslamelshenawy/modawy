const mongoose = require('mongoose');

const AppointmentSchema = mongoose.Schema({
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
    date: {
        type: String,
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    insurance: {
        type: String
    },
    insuranceMemberId: {
        type: String
    },
    newPatient: {
        type: Boolean,
        required: true
    },
    doctorNotes: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    notes: {
        type: String
    },
    hasReview: {
        type: Boolean,
        required: true,
        default: false
    },
    doctorsendflag: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    timestamps: true
});
AppointmentSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Appointment', AppointmentSchema);