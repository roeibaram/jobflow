import { createApplication, deleteApplication, getApplications, updateApplication } from '../services/applicationService.js'

function sendErrorResponse(response, error) {
  response.status(error.statusCode || 500).json({
    message: error.message || 'Something went wrong on the server.',
    details: error.details || null
  })
}

export async function getApplicationsController(request, response) {
  try {
    const applications = await getApplications(request.query)
    response.json(applications)
  } catch (error) {
    sendErrorResponse(response, error)
  }
}

export async function createApplicationController(request, response) {
  try {
    const application = await createApplication(request.body)
    response.status(201).json(application)
  } catch (error) {
    sendErrorResponse(response, error)
  }
}

export async function updateApplicationController(request, response) {
  try {
    const application = await updateApplication(request.params.id, request.body)
    response.json(application)
  } catch (error) {
    sendErrorResponse(response, error)
  }
}

export async function deleteApplicationController(request, response) {
  try {
    await deleteApplication(request.params.id)
    response.status(204).send()
  } catch (error) {
    sendErrorResponse(response, error)
  }
}
