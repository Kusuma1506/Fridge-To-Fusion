import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header.jsx';
import RecipeCard from './components/RecipeCard.jsx';
import Loading from './components/Loading.jsx';
import EmptyState from './components/EmptyState.jsx';
import ErrorState from './components/ErrorState.jsx';
import SiteLoader from './components/SiteLoader.jsx';
import { generateRecipes } from './services/api.js';

const steps = [
  ['01', 'Add ingredients', 'Tell us what is in your kitchen.'],
  ['02', 'AI creates', 'Our chef AI finds delicious combinations.'],
  ['03', 'Start cooking', 'Save, share and cook with confidence.'],
];
const features = [
  'AI generated recipes', 'Smart cooking tips', 'Better ingredient swaps',
  'Nutrition estimates', 'Favorites & sharing', 'Made for every screen',
];

export default function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputError, setInputError] = useState('');
  const [searched, setSearched] = useState(false);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [refinement, setRefinement] = useState('');
  const controllerRef = useRef(null);
  const requestRef = useRef(0);

  const filtered = useMemo(
    () => recipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase())),
    [recipes, query]
  );

  useEffect(() => {
    const saved = localStorage.getItem('fridgefusion-session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((recipe) => recipe?.title)) {
          setRecipes(parsed);
          setSearched(true);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (recipes.length) localStorage.setItem('fridgefusion-session', JSON.stringify(recipes));
  }, [recipes]);

  const submit = async (sourceIngredients = ingredients) => {
    if (typeof sourceIngredients !== 'string') sourceIngredients = ingredients;
    if (!sourceIngredients.trim()) {
      setInputError('Add at least one ingredient before generating a recipe.');
      return;
    }
    setInputError('');
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const id = ++requestRef.current;
    setLoading(true); setError(''); setRecipes([]); setSearched(false);
    try {
      const data = await generateRecipes(sourceIngredients, controller.signal);
      if (id === requestRef.current) { setRecipes(data); setSearched(true); }
    } catch (err) {
      if (err.name !== 'AbortError' && id === requestRef.current) { setError(err.message); setSearched(true); }
    } finally {
      if (id === requestRef.current) setLoading(false);
    }
  };

  const toggleFavorite = (recipe) => setFavorites((curr) =>
    curr.some((f) => f.title === recipe.title) ? curr.filter((f) => f.title !== recipe.title) : [...curr, recipe]
  );

  const refine = () => {
    if (!refinement.trim()) return;
    const refined = `${ingredients}\n\nChef refinement: ${refinement}`;
    setIngredients(refined); setRefinement(''); submit(refined);
  };

  return (
    <SiteLoader>
    <div className={dark ? 'app dark' : 'app'}>
      {/* Full-screen loading overlay */}
      <Loading visible={loading} />

      <Header dark={dark} onTheme={() => setDark(!dark)} favorites={favorites.length} />

      <main>
        {/* ── HERO ── */}
        <section className="hero" id="generate">
          <div className="hero-glow one" />
          <div className="hero-glow two" />

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-copy"
          >
            <p className="kicker">YOUR PERSONAL AI SOUS-CHEF</p>
            <h1>Turn Your Fridge Into <em>Delicious Recipes.</em></h1>
            <p className="hero-text">
              AI-powered recipe ideas made from the ingredients already waiting in your kitchen.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hero-image-wrap"
            aria-hidden="true"
          >
            <img
              src="/assets/hero-kitchen.png"
              alt="Fresh ingredients on a kitchen countertop"
              className="hero-image"
            />
          </motion.div>

          {/* Ingredient box — centered below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="ingredient-box-wrap"
          >
            <div className="ingredient-box">
              <label htmlFor="ingredients">
                What do you have today?
                <span>{ingredients.split(/[\n,]/).filter(Boolean).length} ingredients</span>
              </label>
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder={'Eggs, rice, tomatoes…\nAdd one ingredient per line'}
                disabled={loading}
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) submit(); }}
              />
              {inputError && <p className="input-error" role="alert">{inputError}</p>}
              <div className="ingredient-actions">
                <div className="chips">
                  <span onClick={() => setIngredients((p) => p ? p + '\nVegetarian' : 'Vegetarian')}>🥬 Vegetarian</span>
                  <span onClick={() => setIngredients((p) => p ? p + '\nQuick meal under 20 mins' : 'Quick meal under 20 mins')}>⚡ Quick meals</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="primary-button"
                  onClick={() => submit()}
                  disabled={!ingredients.trim() || loading}
                >
                  {loading ? 'Generating…' : 'Generate recipes →'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="how">
          <p className="kicker">SIMPLE BY DESIGN</p>
          <h2>From ingredients to inspiration.</h2>
          <div className="steps">
            {steps.map(([number, title, text]) => (
              <motion.div whileHover={{ y: -5 }} className="step" key={number}>
                <b>{number}</b>
                <div><h3>{title}</h3><p>{text}</p></div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── RECIPES SECTION ── */}
        <section className="recipes-section" id="recipes">
          <div className="section-heading">
            <div>
              <p className="kicker">YOUR AI COOKBOOK</p>
              <h2>{recipes.length ? 'Recipes made for you.' : 'Ready when you are.'}</h2>
            </div>
            {recipes.length > 0 && (
              <input
                aria-label="Search generated recipes"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes…"
              />
            )}
          </div>

          {recipes.length > 0 && (
            <div className="refine-bar">
              <span>✦ Refine</span>
              <input
                value={refinement}
                onChange={(e) => setRefinement(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && refine()}
                placeholder="Make it vegan, quicker, spicier…"
              />
              <button onClick={refine}>Ask AI</button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {error ? (
              <ErrorState key="error" message={error} onRetry={submit} />
            ) : recipes.length ? (
              <motion.div
                key="cards"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
                initial="hidden"
                animate="show"
                className="recipe-grid"
              >
                {filtered.map((recipe, index) => (
                  <RecipeCard
                    key={`${recipe.title}-${index}`}
                    recipe={recipe}
                    index={index}
                    favorite={favorites.some((f) => f.title === recipe.title)}
                    onFavorite={() => toggleFavorite(recipe)}
                  />
                ))}
              </motion.div>
            ) : (
              <EmptyState key="empty" searched={searched} />
            )}
          </AnimatePresence>
        </section>

        {/* ── FEATURE STRIP ── */}
        <section className="feature-strip">
          <p className="kicker">BUILT FOR BETTER COOKING</p>
          <div>
            {features.map((f) => <span key={f}>✦ {f}</span>)}
          </div>
        </section>
      </main>
    </div>
    </SiteLoader>
  );
}
