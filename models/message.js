const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, minLength:1, maxLength:50, required: true },
  text: { type: String, minLength:1 ,maxLength:500 , required: true },
  time: { type: Date, default: Date.now, required: true },
});

MessageSchema.virtual("date").get(function() {
    return DateTime.fromJSDate(this.time).toFormat("yyyy-MM-dd, HH:mm");
  });

// Export model
module.exports = mongoose.model("Message", MessageSchema);