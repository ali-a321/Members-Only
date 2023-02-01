const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, minLength:3 ,required: true },
  password: { type: String, minLength: 7,required: true },
  member: {type: Boolean, default: false},
  admin: {type: Boolean, default: false},
});



// Export model
module.exports = mongoose.model("User", UserSchema);
