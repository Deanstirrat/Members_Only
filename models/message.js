const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, minLength:3, maxLength: 20, required: 'title is required' },
  message: { type: String, minLength:3, maxLength: 100, required: 'message is required' },
  dateTime: { type: Date },
  postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
