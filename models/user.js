const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, minLength:3, maxLength: 20, required: 'frist name is required' },
  lastName: { type: String, minLength:3, maxLength: 20, required: 'last name is required' },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email address']
  },
  password: { type: String, required: true},
  member: { type: Boolean }
});

// Virtual for user's full name
UserSchema.virtual("fullName").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `${this.firstName} ${this.lastName}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
