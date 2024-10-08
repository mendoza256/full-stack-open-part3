const errorHandler = (error, request, response, next) => {
  console.error("handling error:", error.name, error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

module.exports = errorHandler;
