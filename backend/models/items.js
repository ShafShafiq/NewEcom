const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    itemPrice: { type: Number, required: true },
    itemDescription: { type: String, required: true },
    itemImage:{type:String},
    itemOwner:{type:mongoose.Schema.Types.ObjectId, ref:'Users'},
    
    });

module.exports = mongoose.model('items', itemSchema);