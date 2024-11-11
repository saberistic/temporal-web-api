import { QueryDefinition } from '@temporalio/workflow';
import {
  SampleWorkflowInput,
  SampleWorkflowOutput,
  sampleWorkflow,
} from './sample/workflows';

export interface WorkflowEntry<Input, Output> {
  workflow: (input: Input) => Promise<Output>;
  taskQueue: string;
  queries: Record<string, QueryDefinition<string>>;
}

type WorkflowInput = SampleWorkflowInput;
type WorkflowOutput = SampleWorkflowOutput;

type WorkflowRegistry = {
  [key: string]: WorkflowEntry<WorkflowInput, WorkflowOutput>;
};

export const workflowRegistry: WorkflowRegistry = {
  sampleWorkflow,
};
