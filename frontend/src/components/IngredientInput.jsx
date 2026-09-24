export default function IngredientInput({ value, onChange, onSubmit, loading }) {
  const count = value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean).length;
  return <section className="input-panel" aria-labelledby="ingredients-title">
    <div><p className="eyebrow">YOUR KITCHEN, REIMAGINED</p><h1 id="ingredients-title">What’s in your fridge?</h1><p className="intro">List your ingredients and we’ll turn them into a delicious plan.</p></div>
    <label htmlFor="ingredients">Ingredients <span>{count} item{count === 1 ? '' : 's'}</span></label>
    <textarea id="ingredients" value={value} onChange={(e) => onChange(e.target.value)} placeholder={'Eggs\nMilk\nBread\nTomatoes'} disabled={loading} rows="7" maxLength="2000" />
    <button className="generate-button" onClick={onSubmit} disabled={loading || !value.trim()}>{loading ? 'Creating recipes…' : 'Generate recipes'} <span aria-hidden="true">→</span></button>
  </section>;
}
