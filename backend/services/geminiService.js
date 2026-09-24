import { GoogleGenerativeAI } from '@google/generative-ai';

const schema = `{"recipes":[{"title":"","description":"","servings":2,"cookingTime":30,"difficulty":"","ingredients":[{"name":"","quantity":1,"unit":"piece"}],"steps":[""],"ingredientSwaps":[{"original":"","alternative":""}],"nutrition":{"calories":0,"protein":0,"carbs":0,"fat":0},"tips":[""],"cuisine":"","diet":"","spiceLevel":"","estimatedCost":""}]}`;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseJson(text) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    return JSON.parse(cleaned);
  } catch {
    throw Object.assign(new Error('The AI returned malformed JSON. Please try again.'), { status: 502 });
  }
}

export async function generateRecipes(ingredients) {
  if (!process.env.GEMINI_API_KEY) {
    throw Object.assign(new Error('Server AI configuration is missing.'), { status: 500 });
  }
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const configuredModel = process.env.GEMINI_MODEL;
  const modelName = configuredModel || 'gemini-flash-lite-latest';
  const model = client.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
  });
  const prompt = `You are a creative and practical home chef. Create EXACTLY 4 diverse recipes using these available ingredients:\n${ingredients}\n\nReturn ONLY valid JSON matching this exact schema: ${schema}\nStrict Rules:\n- Return EXACTLY 4 recipes, no more no less\n- No markdown, no prose outside JSON\n- title, description, difficulty, cuisine, diet, spiceLevel and estimatedCost must be non-empty strings\n- servings and cookingTime must be positive numbers\n- ingredients must be an array of objects with a non-empty name, positive numeric quantity, and unit string\n- steps must be an array of at least 3 detailed non-empty strings\n- ingredientSwaps must be an array of objects with non-empty original and alternative strings; include at least 2 useful swaps\n- nutrition must contain numeric calories, protein, carbs, and fat values\n- tips must be an array with at least 1 non-empty string\n- Make the 4 recipes diverse in cuisine and cooking method\n- You may suggest basic pantry staples, but prioritize the provided ingredients`;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('timeout'), { status: 504 })), 30000));
      const result = await Promise.race([model.generateContent(prompt), timeout]);
      return parseJson(result.response.text());
    } catch (error) {
      const retryable = /fetch failed|503|429|timeout/i.test(error.message);
      if (!retryable || attempt === 2) throw Object.assign(new Error(retryable ? 'Gemini is temporarily unavailable. Please retry in a moment.' : 'Gemini request failed. Check your API key and model configuration.'), { status: retryable ? 503 : 502 });
      await wait(1000 * (attempt + 1));
    }
  }
}
