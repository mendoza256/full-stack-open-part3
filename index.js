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
const cors = require("cors");
const morgan = require("morgan");
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

morgan.token("resbody", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms content: :resbody"
  )
);

function generateId() {
  const existingIds = data.map((item) => item.id);

  const newId = Math.floor(Math.random() * 1000) + 1;

  if (existingIds.includes(newId)) {
    return generateRandomUniqueId(data);
  }

  return newId;
}

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
  res.sendStatus(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body) {
    res.status(400).json({
      error: "content missing",
    });
  }

  if (!body.number) {
    res.status(400).json({
      error: "Number is missing",
    });
  }

  if (data.some((person) => person.name === body.name)) {
    res.status(400).json({
      error: "Name already in phonebook",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  data.concat(person);
  res.json(person);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
