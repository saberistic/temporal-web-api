// @@@SNIPSTART typescript-hello-worker
import 'dotenv/config';
import { Worker } from '@temporalio/worker';
import * as activities from '../workflows/sample/activities';
import { createTemporalWorkerConnection } from '../services/temporal';
import { workflowRegistry } from '../workflows/registry';

async function run() {
  const connection = await createTemporalWorkerConnection();
  const worker = await Worker.create({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    workflowsPath: require.resolve('./../workflows/sample/workflows'),
    activities,
    taskQueue: workflowRegistry.sampleWorkflow.taskQueue,
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
// @@@SNIPEND
