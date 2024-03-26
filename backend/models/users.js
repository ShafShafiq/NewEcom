const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  useremail: { type: String, required: true ,unique:true},
  name: { type: String, required: true },
  password: { type: String, required: true },
  accounttype:{ type: String, required: true },
  imageLink:{type:String},
  ItemsToSell:[{type:mongoose.Schema.Types.ObjectId, ref:'items'}],
  phoneNumber:{type:String},
  verified : {type:Boolean, default:false},


});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('Users', userSchema);
