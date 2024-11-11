import { proxyActivities } from '@temporalio/workflow';
import * as workflow from '@temporalio/workflow';

import type * as activities from './activities';
import { WorkflowEntry } from '../registry';

const { sampleActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export const condition = workflow.defineQuery<string>('condition');

export interface SampleWorkflow
  extends WorkflowEntry<SampleWorkflowInput, SampleWorkflowOutput> {
  queries: {
    condition: typeof condition;
  };
}

export interface SampleWorkflowInput {
  name: string;
}

export interface SampleWorkflowOutput {
  name: string;
}

export const sampleWorkflowFunction = async (input: SampleWorkflowInput) => {
  const result = await sampleActivity(input);
  workflow.setHandler(condition, () => 'ok');
  return result;
};

export const sampleWorkflow: SampleWorkflow = {
  workflow: sampleWorkflowFunction,
  taskQueue: 'sample-task-queue',
  queries: {
    condition,
  },
};
