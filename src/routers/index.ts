import express from 'express';
import workflowRouter from './workflowRouter';

const router = express.Router();

router.use('/health', (req, res) => {
  if (req.method === 'GET') {
    res.send('Connection is healthy');
  }
});

router.use('/workflow', workflowRouter);

export default router;
