import './StatsBar.css'

export function StatsBar({ stats }) {
  return (
    <section className="stats-bar">
      {stats.map((stat) => (
        <article className="stats-bar__card" key={stat.label}>
          <span className="stats-bar__label">{stat.label}</span>
          <strong className="stats-bar__value">{stat.value}</strong>
          <span className="stats-bar__helper">{stat.helper}</span>
        </article>
      ))}
    </section>
  )
}
