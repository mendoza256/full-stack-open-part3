const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3 },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /\d+-\d+/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema, "persons");
