const mongoose = require('mongoose');

const SpecialisteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true,
        required: true
    },
    name_ar: {
        type: String,
        unique: true,
        required: true
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialiste',
        default: null
    }
}, {
    timestamps: true
});
SpecialisteSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Specialiste', SpecialisteSchema);