import { Request, Response, NextFunction } from 'express';
import { createTemporalClient } from '../services/temporal';
import { v4 as uuidv4 } from 'uuid';
import { workflowRegistry } from '../workflows/registry'; // Import the workflow registry

class WorkflowController {
  findWorkflow = (name: string) => {
    const workflow = workflowRegistry[name as keyof typeof workflowRegistry];
    if (!workflow) {
      return { workflow: null, queries: null, taskQueue: null };
    }

    return workflow;
  };

  startWorkflow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, args } = req.body;

      if (!name) {
        res.status(400).json({
          message: 'Workflow name is required',
        });
        return;
      }

      const client = await createTemporalClient();
      const id = `${name}-${uuidv4()}`;

      const { workflow, taskQueue } = this.findWorkflow(name);
      if (!workflow) {
        res.status(404).json({
          message: `Workflow ${name} not found in registry`,
        });
        return;
      }

      await client.start(workflow, {
        args: args || [],
        taskQueue: taskQueue!,
        workflowId: id,
      });

      res.status(200).json({
        message: `Workflow ${name} started`,
        id,
      });
    } catch (error) {
      next(error);
    }
  };

  getWorkflowStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.query;

      if (!id) {
        res.status(400).json({
          message: 'Workflow ID is required',
        });
        return;
      }

      const client = await createTemporalClient();
      const handle = client.getHandle(id as string);

      const idStr = id as string;
      const name = idStr.substring(0, idStr.indexOf('-'));

      const { workflow, queries } = this.findWorkflow(name);
      if (!workflow) {
        res.status(404).json({
          message: `Workflow ${name} not found in registry`,
        });
        return;
      }

      const queryResults: Record<string, string> = {};

      if (queries) {
        for (const [queryName, queryFunction] of Object.entries(queries)) {
          try {
            const queryResult = await handle.query(queryFunction);
            queryResults[queryName] = queryResult;
          } catch (e) {
            console.error(`Error querying ${queryName}:`, e);
          }
        }
      }

      const result = await handle.result();
      const status = (await handle.describe()).status;

      res.status(200).json({
        message: `Status of workflow ${id}`,
        result,
        status,
        queries: queryResults,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new WorkflowController();
