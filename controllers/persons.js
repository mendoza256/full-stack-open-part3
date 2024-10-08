const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

personsRouter.get("/info", (req, res) => {
  Person.find({}).then((entries) => {
    const html = `<p>Phonebook has info on ${
      entries.length
    } persons.</p><p>${new Date()}</p>`;
    res.send(html);
  });
});

personsRouter.get("/:id", (req, res, next) => {
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

personsRouter.delete("/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

personsRouter.post("/", (req, res, next) => {
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

  const person = new Person({ name: body.name, number: body.number });
  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error));
});

personsRouter.put("/:id", (req, res, next) => {
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

module.exports = personsRouter;
