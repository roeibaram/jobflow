import './EmptyState.css'

export function EmptyState({ hasSearchOrFilter, onClearFilters }) {
  return (
    <section className="empty-state">
      <div className="empty-state__icon">+</div>
      <h3 className="empty-state__title">{hasSearchOrFilter ? 'No applications match this view' : 'Your tracker is ready for the first application'}</h3>
      <p className="empty-state__copy">
        {hasSearchOrFilter
          ? 'Try clearing the search or switching the status filter to bring more results back into the list.'
          : 'Add your first role in the form on the right, then use statuses and follow-up dates to keep your search organized.'}
      </p>

      {hasSearchOrFilter ? (
        <button className="empty-state__button" type="button" onClick={onClearFilters}>
          Reset this view
        </button>
      ) : null}
    </section>
  )
}
