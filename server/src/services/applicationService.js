import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { readJsonFile, writeJsonFile } from '../utils/fileStore.js'
import { normalizeApplicationPayload, validateApplicationPayload } from '../utils/validation.js'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirectory = path.dirname(currentFilePath)
const applicationsFilePath = path.join(currentDirectory, '../data/applications.json')

function createServiceError(message, statusCode, details) {
  const error = new Error(message)
  error.statusCode = statusCode
  error.details = details
  return error
}

async function readApplications() {
  const applications = await readJsonFile(applicationsFilePath)
  return Array.isArray(applications) ? applications : []
}

async function saveApplications(applications) {
  await writeJsonFile(applicationsFilePath, applications)
}

function sortApplications(applications) {
  return [...applications].sort((firstApplication, secondApplication) => {
    const dateComparison = (secondApplication.dateApplied || '').localeCompare(firstApplication.dateApplied || '')

    if (dateComparison !== 0) {
      return dateComparison
    }

    return (secondApplication.updatedAt || '').localeCompare(firstApplication.updatedAt || '')
  })
}

export async function getApplications(filters = {}) {
  const allApplications = await readApplications()
  const searchValue = (filters.search || '').trim().toLowerCase()

  const filteredApplications = allApplications.filter((application) => {
    const matchesStatus = !filters.status || filters.status === 'All' || application.status === filters.status

    if (!matchesStatus) {
      return false
    }

    if (!searchValue) {
      return true
    }

    const searchableText = [
      application.companyName,
      application.roleTitle,
      application.nextAction,
      application.notes,
      application.recruiter?.name,
      application.recruiter?.email
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchableText.includes(searchValue)
  })

  return sortApplications(filteredApplications)
}

export async function createApplication(payload) {
  const normalizedApplication = normalizeApplicationPayload(payload)
  const validationErrors = validateApplicationPayload(normalizedApplication)

  if (Object.keys(validationErrors).length) {
    throw createServiceError('Please fix the highlighted fields and try again.', 400, validationErrors)
  }

  const existingApplications = await readApplications()
  const timestamp = new Date().toISOString()
  const nextApplication = {
    id: randomUUID(),
    ...normalizedApplication,
    createdAt: timestamp,
    updatedAt: timestamp
  }

  existingApplications.unshift(nextApplication)
  await saveApplications(existingApplications)

  return nextApplication
}

export async function updateApplication(applicationId, payload) {
  const existingApplications = await readApplications()
  const applicationIndex = existingApplications.findIndex((application) => application.id === applicationId)

  if (applicationIndex === -1) {
    throw createServiceError('Application not found.', 404)
  }

  const normalizedApplication = normalizeApplicationPayload(payload)
  const validationErrors = validateApplicationPayload(normalizedApplication)

  if (Object.keys(validationErrors).length) {
    throw createServiceError('Please fix the highlighted fields and try again.', 400, validationErrors)
  }

  const updatedApplication = {
    ...existingApplications[applicationIndex],
    ...normalizedApplication,
    recruiter: normalizedApplication.recruiter,
    updatedAt: new Date().toISOString()
  }

  existingApplications[applicationIndex] = updatedApplication
  await saveApplications(existingApplications)

  return updatedApplication
}

export async function deleteApplication(applicationId) {
  const existingApplications = await readApplications()
  const remainingApplications = existingApplications.filter((application) => application.id !== applicationId)

  if (remainingApplications.length === existingApplications.length) {
    throw createServiceError('Application not found.', 404)
  }

  await saveApplications(remainingApplications)
}
