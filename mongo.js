const mongoose = require("mongoose");

if (process.argv.length < 3) {
  process.exit(1);
}

const name = process.argv[2];
const number = process.argv[3];

const url = process.env.MONGO_DB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema, "persons");

if (!name && !number) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      // eslint-disable-next-line no-console
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    mongoose.connection.close();
  });
}
