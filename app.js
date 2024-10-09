const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const personsRouter = require("./controllers/persons");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

if (!config.MONGODB_URI) {
  throw new Error("MONGODB_URI not defined");
}

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("resbody", function (req) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms content: :resbody"
  )
);

app.use("/api/persons", personsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
