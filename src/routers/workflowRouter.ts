import express from 'express';
import WorkflowController from '../controllers/workflowController';

const workflowRouter = express.Router();

workflowRouter.post('/start', WorkflowController.startWorkflow);
workflowRouter.get('/status', WorkflowController.getWorkflowStatus);

export default workflowRouter;
