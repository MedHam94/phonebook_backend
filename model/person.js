const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log('Connecting...');

mongoose.connect(url).then((res) => {
  console.log("mongodb connected");
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnObj) => {
    returnObj.id = returnObj._id.toString();
    delete returnObj._id;
    delete returnObj.__v;
  },
});

module.exports = mongoose.model("Persons", personSchema);
