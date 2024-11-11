import 'dotenv/config';
import {
  Connection,
  ConnectionOptions,
  WorkflowClient,
} from '@temporalio/client';
import { NativeConnection } from '@temporalio/worker';
import fs from 'fs';
let temporalConnConfig: ConnectionOptions;

if (
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'sandbox'
) {
  temporalConnConfig = {
    address: process.env.TEMPORAL_ADDRESS!,
    tls: {
      clientCertPair: {
        crt: Buffer.from(
          fs.readFileSync(process.env.TEMPORAL_TLS_CRT!, 'utf8'),
        ),
        key: Buffer.from(
          fs.readFileSync(process.env.TEMPORAL_TLS_KEY!, 'utf8'),
        ),
      },
    },
  };
} else {
  temporalConnConfig = {
    address: process.env.TEMPORAL_ADDRESS!,
  };
}

export const createTemporalClient = async () => {
  const connection = await Connection.connect(temporalConnConfig);

  const client = new WorkflowClient({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
  });

  return client;
};

export async function createTemporalWorkerConnection() {
  const connection = await NativeConnection.connect({
    address: temporalConnConfig.address,
    tls: temporalConnConfig.tls,
  });
  return connection;
}
