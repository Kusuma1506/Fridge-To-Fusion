import { generateRecipes } from '../services/geminiService.js';
import { validateRecipeResponse } from '../utils/validateResponse.js';

export async function generateRecipe(req, res, next) {
  try {
    const { ingredients } = req.body || {};
    if (typeof ingredients !== 'string' || !ingredients.trim()) {
      return res.status(400).json({ error: 'Please provide at least one ingredient.' });
    }
    if (ingredients.trim().length > 2000) {
      return res.status(400).json({ error: 'Ingredients must be 2,000 characters or fewer.' });
    }
    const aiResponse = await generateRecipes(ingredients.trim());
    const validation = validateRecipeResponse(aiResponse);
    if (!validation.valid) {
      console.error('Validation failed. AI Response was:', JSON.stringify(aiResponse, null, 2));
      return res.status(502).json({ error: 'Unable to generate a valid recipe. Please try again.' });
    }
    return res.status(200).json(validation.data);
  } catch (error) {
    return next(error);
  }
}
