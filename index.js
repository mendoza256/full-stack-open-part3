require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");
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

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      console.log(err);
      response.status(400).send({ error: "malformatted id" });
    });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then((result) => {
    res.status(204).end();
  });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

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

  Person.find({ name: body.name }).then((data) => {
    if (data.length > 0) {
      res.status(400).json({
        error: "Name already in phonebook",
      });
      return;
    }
  });

  const person = new Person({ name: body.name, number: body.number });

  person.save().then((savedPerson) => res.json(savedPerson));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
