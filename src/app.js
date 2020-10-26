const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id);
  if (index < 0) {
    return response.status(400).json({ error: "Repositório não encontrado." });
  }

  return next();
}

app.use("/repositories/:id", validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  const repository = { ...repositories[repositoryIndex] };

  if (title) {
    repository.title = title;
  }

  if (url) {
    repository.url = url;
  }

  if (techs) {
    repository.techs = techs;
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  const repository = repositories[repositoryIndex];

  repository.likes++;

  return response.status(200).json(repository);
});

module.exports = app;
