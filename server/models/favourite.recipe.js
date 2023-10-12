const mongoose = require("mongoose");

const favouriteRecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user",
  },
  recipe: {
    type: Object,
  },
  createdAt: { type: Date, default: Date.now } 
});

const favouriteRecipeModel = mongoose.model("favouriteRecipe",favouriteRecipeSchema);

module.exports = {favouriteRecipeModel}
