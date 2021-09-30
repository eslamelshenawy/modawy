const mongoose = require('mongoose');

const resettokenSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    _userId: mongoose.Schema.Types.ObjectId,
    resettoken:  String,
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
}, {
    timestamps: true
});


resettokenSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('passwordResetToken', resettokenSchema);