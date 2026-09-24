const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const REQUEST_TIMEOUT = 100000;

const isText = (value) => typeof value === 'string' && value.trim().length > 0;

function isRecipe(recipe) {
  return Boolean(
    recipe && typeof recipe === 'object' &&
    isText(recipe.title) && isText(recipe.description) &&
    typeof recipe.servings === 'number' && recipe.servings >= 1 &&
    typeof recipe.cookingTime === 'number' && recipe.cookingTime >= 1 &&
    Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 &&
    recipe.ingredients.every((item) => item && isText(item.name) && typeof item.quantity === 'number' && item.quantity > 0 && isText(item.unit)) &&
    Array.isArray(recipe.steps) && recipe.steps.length >= 3 && recipe.steps.every(isText) &&
    Array.isArray(recipe.ingredientSwaps) && recipe.ingredientSwaps.every((swap) => swap && isText(swap.original) && isText(swap.alternative)) &&
    recipe.nutrition && ['calories', 'protein', 'carbs', 'fat'].every((field) => typeof recipe.nutrition[field] === 'number' && recipe.nutrition[field] >= 0)
  );
}

function validateRecipePayload(data) {
  if (!data || !Array.isArray(data.recipes) || data.recipes.length === 0 || !data.recipes.every(isRecipe)) {
    throw new Error('Unable to generate a valid recipe. Please try again.');
  }
  return data.recipes;
}

export async function generateRecipes(ingredients, signal) {
  let response;
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT);
  const abortRequest = () => timeoutController.abort();
  signal?.addEventListener('abort', abortRequest, { once: true });
  try {
    response = await fetch(`${API_URL}/api/generate-recipe`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients }), signal: timeoutController.signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    if (error.name === 'AbortError') throw new Error('Recipe generation is taking too long. Please try again.');
    throw new Error('Unable to reach the server. Check your connection and try again.');
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortRequest);
  }
  let data;
  try { data = await response.json(); } catch { throw new Error('The server returned an unexpected response.'); }
  if (!response.ok) throw new Error(data?.error || 'Unable to generate recipes right now.');
  return validateRecipePayload(data);
}
