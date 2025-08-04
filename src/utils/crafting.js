// Utility for crafting logic
import recipes from '../data/recipes.json';

export function craft(ingredientIds) {
  // Sort for consistent matching
  const sorted = [...ingredientIds].sort();
  for (const recipe of recipes) {
    if (
      recipe.ingredients.length === sorted.length &&
      [...recipe.ingredients].sort().every((id, i) => id === sorted[i])
    ) {
      return {
        result: recipe.result,
        abilities: recipe.abilities,
      };
    }
  }
  return null;
}
