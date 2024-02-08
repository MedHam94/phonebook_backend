const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log('Connecting...');

mongoose.connect(url).then((res) => {
  console.log("mongodb connected");
});

const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength:3,
    required: true
  },    
  number: {
    type:String,
    minLength:8,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{7,8}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`},
    required: true
  }
});

personSchema.set("toJSON", {
  transform: (document, returnObj) => {
    returnObj.id = returnObj._id.toString();
    delete returnObj._id;
    delete returnObj.__v;
  },
});

module.exports = mongoose.model("Persons", personSchema);
