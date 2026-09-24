const requiredTextFields = ['title', 'description', 'difficulty'];

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

function validateIngredient(ingredient) {
  return Boolean(
    ingredient &&
    typeof ingredient === 'object' &&
    isNonEmptyString(ingredient.name) &&
    typeof ingredient.quantity === 'number' &&
    Number.isFinite(ingredient.quantity) &&
    ingredient.quantity > 0 &&
    isNonEmptyString(ingredient.unit)
  );
}

function validateSwap(swap) {
  return Boolean(
    swap &&
    typeof swap === 'object' &&
    isNonEmptyString(swap.original) &&
    isNonEmptyString(swap.alternative)
  );
}

function validateNutrition(nutrition) {
  return Boolean(
    nutrition &&
    typeof nutrition === 'object' &&
    ['calories', 'protein', 'carbs', 'fat'].every((field) => (
      typeof nutrition[field] === 'number' && Number.isFinite(nutrition[field]) && nutrition[field] >= 0
    ))
  );
}

export function validateRecipeResponse(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, error: 'AI returned an empty or invalid response.' };
  }
  if (!Array.isArray(payload.recipes)) {
    return { valid: false, error: 'AI response is missing the recipes list.' };
  }
  if (payload.recipes.length === 0) return { valid: false, error: 'AI returned no recipes.' };

  for (const recipe of payload.recipes) {
    if (!recipe || typeof recipe !== 'object' || Array.isArray(recipe)) {
      return { valid: false, error: 'AI returned an invalid recipe.' };
    }
    for (const field of requiredTextFields) {
      if (!isNonEmptyString(recipe[field])) {
        return { valid: false, error: `Recipe field "${field}" is invalid.` };
      }
    }
    if (typeof recipe.servings !== 'number' || !Number.isFinite(recipe.servings) || recipe.servings < 1) {
      return { valid: false, error: 'Recipe servings must be a positive number.' };
    }
    if (typeof recipe.cookingTime !== 'number' || !Number.isFinite(recipe.cookingTime) || recipe.cookingTime < 1) {
      return { valid: false, error: 'Recipe cooking time must be a positive number.' };
    }
    if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0 || !recipe.ingredients.every(validateIngredient)) {
      return { valid: false, error: 'Recipe ingredients have an invalid format.' };
    }
    if (!Array.isArray(recipe.steps) || recipe.steps.length < 3 || !recipe.steps.every(isNonEmptyString)) {
      return { valid: false, error: 'Recipe steps must contain at least three valid items.' };
    }
    if (!Array.isArray(recipe.ingredientSwaps) || !recipe.ingredientSwaps.every(validateSwap)) {
      return { valid: false, error: 'Recipe ingredient swaps have an invalid format.' };
    }
    if (!validateNutrition(recipe.nutrition)) {
      return { valid: false, error: 'Recipe nutrition has an invalid format.' };
    }
    if (!Array.isArray(recipe.tips) || recipe.tips.length === 0 || !recipe.tips.every(isNonEmptyString)) {
      return { valid: false, error: 'Recipe tips must contain at least one valid item.' };
    }
  }
  return { valid: true, data: { recipes: payload.recipes } };
}
