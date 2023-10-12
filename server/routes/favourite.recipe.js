const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { favouriteRecipeModel } = require("../models/favourite.recipe.js");
const axios = require("axios");

const favouriteRecipeRouter = express.Router();

favouriteRecipeRouter.post("/", auth, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.body; // client sends the 'id' of the recipe

    // Fetch recipe data from Spoonacular using the 'id'
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.API_KEY}`
    );
    const recipe = response.data; // contains recipe data

    if (!recipe || !recipe.id) {
      return res
        .status(400)
        .send({ error: "Invalid recipe data from Spoonacular" });
    }

    // Check if the recipe is already saved as a favourite by the user
    const existingfavourite = await favouriteRecipeModel.findOne({
      user: user._id,
      "recipe.id": recipe.id,
    });

    if (existingfavourite) {
      return res
        .status(409)
        .send({ error: "Recipe is already saved as a favourite" });
    }

    // Create a new favourite recipe document
    const newfavourite = new favouriteRecipeModel({
      user: user._id,
      recipe,
    });

    await newfavourite.save();

    res.status(201).send({ message: "favourite recipe saved successfully" });
  } catch (error) {
    console.error("Error saving favourite recipe:", error);
    res
      .status(500, 409)
      .send({ error: "Error occurred while saving the favourite recipe" });
  }
});

// Get Favroites only authorised user's data
favouriteRecipeRouter.get("/", auth, async (req, res) => {
  try {
    const favourites = await favouriteRecipeModel.find({ user: req.user._id }).sort({ createdAt: -1 })
    console.log(favourites);

    res.status(200).send(favourites);
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error);
  }
});

// // Delete Favourite Recipe

favouriteRecipeRouter.delete("/:id",auth,async(req,res)=>{
  const favoriteRecipeId = req.params.id;
  try {
    // Check if the favorite recipe exists
    const existingRecipe = await favouriteRecipeModel.findById(favoriteRecipeId);

    if (!existingRecipe) {
      return res.status(404).json({ message: 'Favorite recipe not found' });
    }

    // Check if the authenticated user is the owner of the favorite recipe
    if (existingRecipe.user.toString() !== req.user._id) {
      return res.status(403).json({ message: 'You do not have permission to delete this favorite recipe' });
    }

    // If the checks pass, delete the favorite recipe
    await favouriteRecipeModel.findByIdAndDelete(favoriteRecipeId);
    
    // Respond with a success status
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})


module.exports = {favouriteRecipeRouter}
