const express = require("express");
const axios = require("axios");
const recipeRouter = express.Router();
require("dotenv").config();

recipeRouter.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/random?apiKey=${process.env.API_KEY}&number=25`
    );


    const recipes = response.data.recipes;
    res.status(200).send({ message: "data", recipes });
  } catch (error) {
    console.error("Error fetching random recipes:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching random recipes" });
  }
});

recipeRouter.get("/search", async (req, res) => {
  const { query } = req.query;
  const response = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${process.env.API_KEY}&number=20`
  );
  const recipes = response.data.results;
  res.status(200).send({ message: "data", recipes });
});

recipeRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const response = await axios.get(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.API_KEY}`
  );
  const recipe = response.data;
  res.status(200).send({ message: "data", recipe });
});

module.exports = {
  recipeRouter,
};
