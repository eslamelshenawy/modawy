const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    feedback: {
        type: String,
        required: true
    },
    type_feedback: {
        type: String,
        enum: ['Comments', 'Bugreports', 'questions'],
        default: 'Comments'
    },
  

}, {
    timestamps: true
});
feedbackSchema.set('toJSON', {
    virtuals: true
});

// Apply the uniqueValidator plugin to userSchema.
// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Feedback', feedbackSchema);