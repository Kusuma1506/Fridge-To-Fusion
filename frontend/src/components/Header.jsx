export default function Header({ dark, onTheme, favorites }) {
  return (
    <header className="topbar">
      <a className="logo" href="/" aria-label="FridgeFusion home">
        <img src="/assets/fridgefusion-logo.png" alt="FridgeFusion" />
      </a>
      <nav aria-label="Main navigation">
        <a href="#generate">Generate</a>
        <a href="#recipes">Recipes</a>
        <span>♡ {favorites}</span>
        <button className="theme-toggle" onClick={onTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}>
          {dark ? '☀ Light' : '☾ Dark'}
        </button>
      </nav>
    </header>
  );
}
