import { Router } from 'express'
import {
  createApplicationController,
  deleteApplicationController,
  getApplicationsController,
  updateApplicationController
} from '../controllers/applicationController.js'

const router = Router()

router.route('/').get(getApplicationsController).post(createApplicationController)
router.route('/:id').put(updateApplicationController).delete(deleteApplicationController)

export default router
