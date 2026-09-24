import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Curated high-quality Unsplash food photography
const foodImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80', // colorful salad bowl
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=900&q=80', // pancakes
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80', // grilled meat
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80', // healthy bowl
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80', // pasta
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80', // pizza
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80', // french toast
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80', // soup bowl
];

const spiceBadge = (level) => {
  const map = { mild: '🌶', medium: '🌶🌶', hot: '🌶🌶🌶', 'very hot': '🌶🌶🌶🌶' };
  return map[(level || '').toLowerCase()] || '🌶';
};

const formatQuantity = (value) => {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
};

export default function RecipeCard({ recipe, index, favorite, onFavorite }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timerMins, setTimerMins] = useState(0);
  const [servings, setServings] = useState(recipe.servings);
  const [completedSteps, setCompletedSteps] = useState([]);
  const imgSrc = foodImages[index % foodImages.length];
  const servingRatio = servings / recipe.servings;

  useEffect(() => {
    setServings(recipe.servings);
    setCompletedSteps([]);
  }, [recipe]);

  const toggleStep = (stepIndex) => setCompletedSteps((current) => (
    current.includes(stepIndex) ? current.filter((item) => item !== stepIndex) : [...current, stepIndex]
  ));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${recipe.title}\n\nIngredients:\n${recipe.ingredients.map((item) => `${formatQuantity(item.quantity * servingRatio)} ${item.unit} ${item.name}`).join('\n')}\n\nMethod:\n${recipe.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nChef's Tips:\n${(recipe.tips || []).join('\n')}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 90 }}
      className="recipe-card"
    >
      {/* Image */}
      <div className="recipe-card__image-wrap">
        <img loading="lazy" src={imgSrc} alt={recipe.title} className="recipe-card__image" />
        <div className="recipe-card__image-overlay" />
        <button className="recipe-card__fav" onClick={onFavorite} aria-label="Favourite">
          {favorite ? '♥' : '♡'}
        </button>
        <div className="recipe-card__badges">
          {recipe.diet && <span className="badge badge--diet">{recipe.diet}</span>}
          {recipe.cuisine && <span className="badge badge--cuisine">{recipe.cuisine}</span>}
        </div>
      </div>

      {/* Header Info */}
      <div className="recipe-card__body">
        <h3 className="recipe-card__title">{recipe.title}</h3>
        <p className="recipe-card__desc">{recipe.description}</p>

        <div className="recipe-card__meta">
          <span>⏱ {recipe.cookingTime} min</span>
          <span>📊 {recipe.difficulty}</span>
          <span>👥 {servings} servings</span>
          <span>🔥 {recipe.nutrition.calories} kcal</span>
          {recipe.spiceLevel && <span>{spiceBadge(recipe.spiceLevel)} {recipe.spiceLevel}</span>}
          {recipe.estimatedCost && <span>💰 {recipe.estimatedCost}</span>}
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="recipe-card__details"
            >
              {/* Ingredients */}
              <section className="recipe-section">
                <h4 className="recipe-section__heading">🥕 Ingredients</h4>
                <ul className="recipe-list recipe-list--ingredients">
                  {recipe.ingredients.map((item, i) => (
                    <li key={i}><span className="dot" /> {formatQuantity(item.quantity * servingRatio)} {item.unit} {item.name}</li>
                  ))}
                </ul>
              </section>

              <div className="serving-control" aria-label="Adjust servings">
                <span>Scale servings</span>
                <button type="button" onClick={() => setServings((value) => Math.max(1, value - 1))} aria-label="Decrease servings">−</button>
                <strong>{servings}</strong>
                <button type="button" onClick={() => setServings((value) => value + 1)} aria-label="Increase servings">+</button>
              </div>

              {/* Method */}
              <section className="recipe-section">
                <h4 className="recipe-section__heading">👨‍🍳 Method</h4>
                <ol className="recipe-list recipe-list--steps">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className={completedSteps.includes(i) ? 'is-complete' : ''}>
                      <label className="step-check">
                        <input type="checkbox" checked={completedSteps.includes(i)} onChange={() => toggleStep(i)} />
                        <span className="step-num">{i + 1}</span>
                        <span>{step}</span>
                      </label>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Tips */}
              {recipe.tips?.length > 0 && (
                <section className="recipe-section recipe-section--tip">
                  <h4 className="recipe-section__heading">💡 Chef's Tips</h4>
                  <ul className="recipe-list recipe-list--tips">
                    {recipe.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </section>
              )}

              {recipe.ingredientSwaps.length > 0 && (
                <section className="recipe-section recipe-section--health">
                  <h4 className="recipe-section__heading">🔁 Ingredient Swaps</h4>
                  <ul className="recipe-list recipe-list--subs">
                    {recipe.ingredientSwaps.map((swap, i) => <li key={i}><strong>{swap.original}</strong> → {swap.alternative}</li>)}
                  </ul>
                </section>
              )}

              {/* Nutrition */}
              <div className="recipe-nutrition">
                <div><strong>Nutrition estimates</strong><span>AI-generated per serving</span></div>
                <dl><div><dt>Calories</dt><dd>{recipe.nutrition.calories}</dd></div><div><dt>Protein</dt><dd>{recipe.nutrition.protein}g</dd></div><div><dt>Carbs</dt><dd>{recipe.nutrition.carbs}g</dd></div><div><dt>Fat</dt><dd>{recipe.nutrition.fat}g</dd></div></dl>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Buttons */}
        <div className="recipe-card__footer">
          <button className="rc-btn rc-btn--primary" onClick={() => setExpanded(!expanded)}>
            {expanded ? '▲ Close' : '▼ View Recipe'}
          </button>
          <button className="rc-btn" onClick={copy}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
          <button
            className={`rc-btn ${timerMins > 0 ? 'rc-btn--active' : ''}`}
            onClick={() => setTimerMins(t => t + 1)}
          >
            ⏱ {timerMins > 0 ? `${timerMins}m` : 'Timer'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
