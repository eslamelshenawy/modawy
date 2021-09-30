const mongoose = require('mongoose');

const InsuranceSchema = mongoose.Schema({
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
    }
}, {
    timestamps: true
});
InsuranceSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Insurance', InsuranceSchema);