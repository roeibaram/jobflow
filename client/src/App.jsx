import { useEffect, useMemo, useState } from 'react'
import { createApplication, deleteApplication, getApplications, updateApplication } from './api/applicationsApi'
import { ApplicationForm } from './components/ApplicationForm/ApplicationForm'
import { ApplicationList } from './components/ApplicationList/ApplicationList'
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader'
import { FilterBar } from './components/FilterBar/FilterBar'
import { ReminderPanel } from './components/ReminderPanel/ReminderPanel'
import { StatsBar } from './components/StatsBar/StatsBar'
import { getApplicationStats, getFilteredApplications, getReminderItems } from './utils/application'
import './App.css'

function App() {
  const [applications, setApplications] = useState([])
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingApplication, setEditingApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadApplications()
  }, [])

  async function loadApplications(showLoader = true) {
    if (showLoader) {
      setLoading(true)
    }

    try {
      const data = await getApplications()
      setApplications(data)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load your applications right now.')
    } finally {
      if (showLoader) {
        setLoading(false)
      }
    }
  }

  async function handleSaveApplication(formData) {
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      if (editingApplication) {
        await updateApplication(editingApplication.id, formData)
      } else {
        await createApplication(formData)
      }

      await loadApplications(false)
      setEditingApplication(null)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save your changes right now.')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteApplication(applicationId) {
    const confirmed = window.confirm('Delete this application from the tracker?')

    if (!confirmed) {
      return
    }

    try {
      await deleteApplication(applicationId)
      await loadApplications(false)

      if (editingApplication?.id === applicationId) {
        setEditingApplication(null)
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to delete this application right now.')
    }
  }

  function handleEditApplication(application) {
    setEditingApplication(application)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingApplication(null)
  }

  function handleClearFilters() {
    setSearchQuery('')
    setStatusFilter('All')
  }

  const visibleApplications = useMemo(() => {
    return getFilteredApplications(applications, statusFilter, searchQuery)
  }, [applications, searchQuery, statusFilter])

  const stats = useMemo(() => getApplicationStats(applications), [applications])
  const reminders = useMemo(() => getReminderItems(applications), [applications])
  const hasSearchOrFilter = statusFilter !== 'All' || Boolean(searchQuery.trim())

  return (
    <div className="app">
      <div className="app__glow app__glow--left" />
      <div className="app__glow app__glow--right" />

      <div className="app__container">
        <DashboardHeader />
        <StatsBar stats={stats} />

        <div className="app__dashboard">
          <main className="app__main">
            <FilterBar
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              hasSearchOrFilter={hasSearchOrFilter}
              onClearFilters={handleClearFilters}
              onSearchChange={setSearchQuery}
              onStatusChange={setStatusFilter}
              resultCount={visibleApplications.length}
            />

            {errorMessage ? <div className="app__feedback app__feedback--error">{errorMessage}</div> : null}

            {loading ? (
              <div className="app__loading">Loading Jobflow...</div>
            ) : (
              <ApplicationList
                applications={visibleApplications}
                hasSearchOrFilter={hasSearchOrFilter}
                onClearFilters={handleClearFilters}
                onEdit={handleEditApplication}
                onDelete={handleDeleteApplication}
              />
            )}
          </main>

          <aside className="app__sidebar">
            <ApplicationForm
              applicationToEdit={editingApplication}
              isSubmitting={isSubmitting}
              onSubmit={handleSaveApplication}
              onCancelEdit={handleCancelEdit}
            />
            <ReminderPanel reminders={reminders} />
          </aside>
        </div>
      </div>
    </div>
  )
}

export default App
