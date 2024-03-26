const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
    token: { type: String, required: true },
});
module.exports = mongoose.model('Token', tokenSchema);
