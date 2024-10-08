require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");
const errorHandler = require("./middleware/error");
const unknownEndpoint = require("./middleware/unknownEndpoint");
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("resbody", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms content: :resbody"
  )
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get("/info", (req, res) => {
  Person.find({}).then((entries) => {
    const html = `<p>Phonebook has info on ${
      entries.length
    } persons.</p><p>${new Date()}</p>`;
    res.send(html);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  console.log("posting person");
  const body = req.body;
  console.log("body:", body);

  if (body === undefined) {
    res.status(400).json({
      error: "body missing",
    });
    return;
  }

  if (!body.number) {
    res.status(400).json({
      error: "Number is missing",
    });
    return;
  }

  if (!body.name) {
    res.status(400).json({
      error: "Name is missing",
    });
    return;
  }

  const person = new Person({ name: body.name, number: body.number });
  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;
  const updatedPerson = {
    name,
    number,
  };

  Person.findByIdAndUpdate(req.params.id, updatedPerson, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updated) => res.json(updated))
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
