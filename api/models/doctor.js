const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const doctorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        index: true,
        trim: true,
        // unique: true,
        // uniqueCaseInsensitive: true,
        // required: function() { return this.userType === 'doctor'; } ,// Only required if a equals 'test'
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        // index: true
    },
    education: {
        type: String,
        required: true
    },
    awards: {
        type: String,
        required: true
    },
    specialistes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialiste'
    }],
    networkInsurances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Insurance'
    }],
    about: {
        type: String
    },
    address: {
        location: {
            type: String
        },
        Latitude: {
            type: String
        },
        Longitude: {
            type: String
        }
    }
}, {
    timestamps: true
});

// Apply the uniqueValidator plugin to userSchema.
doctorSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Doctor', doctorSchema);