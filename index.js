const data = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const express = require("express");
const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/api/persons", (req, res) => {
  res.json(data);
});

app.get("/info", (req, res) => {
  const html = `<p>Phonebook has info on ${
    data.length
  } people.</p><p>${new Date()}</p>`;
  res.send(html);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = data.find((person) => person.id == id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  data.filter((person) => person.id !== id);
  res.send(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
