const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter(repo => repo.title.includes(title))
    : repositories;

  response.json(results);
});


app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0 // default value para o número de likes
  }

  repositories.push(repositorie);

  return response.json(repositorie);

});


app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  const likes = repositories[repositorieIndex].likes;
  
  if (repositorieIndex < 0) {
    return response.status(400).json({error: "Repositório não encontrado"});
  }
  
  const {title, url, techs} = request.body;
  
  repositories[repositorieIndex] = {
    id,
    title,
    url,
    techs,
    likes
  };

  return response.json(repositories[repositorieIndex]);
});


app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  if (repositorieIndex < 0) {
    return response.status(400).json({error: "Repositório não encontrado"});
  }

  repositories.splice(repositorieIndex, 1);
  return response.status(204).send();

});


app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  if (repositorieIndex < 0) 
    return response.status(400).json({error: "Repositório não encontrado"});
  else
    repositories[repositorieIndex].likes = repositories[repositorieIndex].likes + 1;

  return response.json({
    sucess: "Você curtiu este Repositório",
    repo: repositories[repositorieIndex]
  });
});

module.exports = app;
