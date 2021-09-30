const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    telephones: [{
        phoneNumber: String
    }],
    favouriteList:[String],
    userType: {
        type: String,
        enum: ['user', 'admin', 'doctor'],
        default: 'user'
    },

    gender: {
        type: String,
        enum: ["male", "female"]
    },
    profileImage: {
        type: String
    },
    doctorInfo: {
        title: {
            type: String
        },
        username: {
            type: String,
            // index: true,
            trim: true,
            unique: false,
            uniqueCaseInsensitive: false,
            required: function () {
                return this.userType === 'doctor';
            }, // Only required if a equals 'test'
            match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
            // index: true
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
        title: {
            type: String
        },
        phoneNumber: {
            type: String
        }
        ,
        address: {
            location: {
                type: String
            },
            location_ar: {
                type: String
            },
            latitude: {
                type: String
            },
            longitude: {
                type: String
            }
        },
        education: {
            type: String
        },
        awards: {
            type: String
        },
        verifiedFlag: {
            type: Boolean,
            default: false
        },
        overAll_rating: {
            type: Number,
            default: 0
        },
        total_ratings: {
            type: Number,
            default: 0
        },
        fees: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 'Pound'
        },
        viewCount: {
            type: Number,
            default: 0,
        }

    },
    website: {
        type: String
    },
    instagram: {
        type: String
    },
    facebook: {
        type: String
    },
    youtube: {
        type: String
    }
}, {
    timestamps: true
});


// Apply the uniqueValidator plugin to userSchema.
// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);