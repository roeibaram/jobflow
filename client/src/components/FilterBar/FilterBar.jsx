import { applicationSortOptions, statusFilterOptions } from '../../constants/options'
import './FilterBar.css'

export function FilterBar({
  searchQuery,
  sortMode,
  statusFilter,
  hasSearchOrFilter,
  onClearFilters,
  onSearchChange,
  onSortChange,
  onStatusChange,
  resultCount
}) {
  const activeFilterLabels = [
    statusFilter !== 'All' ? `Status: ${statusFilter}` : null,
    searchQuery.trim() ? `Search: ${searchQuery.trim()}` : null
  ].filter(Boolean)

  return (
    <section className="filter-bar">
      <div className="filter-bar__top-row">
        <div>
          <h2 className="filter-bar__title">Application pipeline</h2>
          <p className="filter-bar__caption">{resultCount} role{resultCount === 1 ? '' : 's'} visible</p>
        </div>

        <div className="filter-bar__controls">
          <label className="filter-bar__search-field">
            <span className="filter-bar__control-label">Search</span>
            <input
              className="filter-bar__search-input"
              type="search"
              placeholder="Company, role, recruiter, posting link, notes"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </label>

          <label className="filter-bar__sort-field">
            <span className="filter-bar__control-label">Sort</span>
            <select className="filter-bar__sort-select" value={sortMode} onChange={(event) => onSortChange(event.target.value)}>
              {applicationSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="filter-bar__chips" aria-label="Filter by status">
        {statusFilterOptions.map((status) => (
          <button
            key={status}
            type="button"
            className={`filter-bar__chip ${statusFilter === status ? 'filter-bar__chip--active' : ''}`}
            onClick={() => onStatusChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {activeFilterLabels.length ? (
        <ul className="filter-bar__active-list" aria-label="Active pipeline filters">
          {activeFilterLabels.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      ) : null}

      {hasSearchOrFilter ? (
        <div className="filter-bar__actions">
          <p className="filter-bar__active-copy">Showing a filtered view.</p>
          <button className="filter-bar__clear-button" type="button" onClick={onClearFilters}>
            Clear search and filters
          </button>
        </div>
      ) : null}
    </section>
  )
}
