import "../styles/LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-home">
      <div className="loading-home__overlay" />

      <header className="loading-home__topbar">
        <div className="loading-home__badge shimmer" />
        <div className="loading-home__search shimmer" />
      </header>

      <section className="loading-home__hero">
        <div className="loading-home__content">
          <div className="loading-home__title shimmer" />
          <div className="loading-home__title short shimmer" />

          <div className="loading-home__meta-row">
            <div className="loading-home__meta imdb shimmer" />
            <div className="loading-home__meta rating shimmer" />
            <div className="loading-home__meta year shimmer" />
            <div className="loading-home__meta runtime shimmer" />
            <div className="loading-home__meta genre shimmer" />
          </div>

          <div className="loading-home__description">
            <div className="loading-home__line shimmer" />
            <div className="loading-home__line shimmer" />
            <div className="loading-home__line shimmer" />
            <div className="loading-home__line short shimmer" />
          </div>

          <div className="loading-home__arrows">
            <div className="loading-home__arrow shimmer" />
            <div className="loading-home__arrow shimmer" />
          </div>
        </div>
      </section>

      <section className="loading-home__carousel">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className={`loading-home__card shimmer ${index === 5 ? "active" : ""}`}
          />
        ))}
      </section>
    </div>
  );
}