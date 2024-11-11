# Temporal Web API

## Description

**Temporal Web API** is a Node.js application that provides a web interface to interact with [Temporal](https://temporal.io/) workflows. It allows users to start workflows and retrieve their status via HTTP endpoints. This application serves as a bridge between HTTP requests and Temporal's workflow orchestration capabilities.

## Features

- **Start Workflows**: Initiate Temporal workflows through RESTful API calls.
- **Check Workflow Status**: Retrieve the status and results of ongoing or completed workflows.
- **Health Check Endpoint**: Simple endpoint to verify the server's running status.
- **Sample Workflows**: Includes sample workflows and activities for demonstration purposes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [Docker Usage](#docker-usage)
- [Usage](#usage)
  - [Health Check](#health-check)
  - [Start a Workflow](#start-a-workflow)
  - [Get Workflow Status](#get-workflow-status)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [License](#license)

## Prerequisites

- **Node.js** (version 18.7.0 or higher)
- **NPM** (comes with Node.js)
- **Temporal Server** (local or remote instance)
- **Docker** (optional, for containerized deployment)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/temporal-web-api.git
   cd temporal-web-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

## Configuration

1. **Environment Variables**

   Create a `.env` file in the root directory and set the following environment variables:

   ```dotenv
   # Temporal configuration
   TEMPORAL_ADDRESS=localhost:7233
   TEMPORAL_NAMESPACE=default

   # Server configuration
   PORT=5000

   # TLS configuration (if applicable)
   TEMPORAL_TLS_CRT=path/to/your/certificate.crt
   TEMPORAL_TLS_KEY=path/to/your/private.key

   # Node environment
   NODE_ENV=development
   ```

   - Replace `localhost:7233` with your Temporal server address if different.
   - Set `NODE_ENV` to `production` or `sandbox` if you are deploying to those environments.

2. **Configure Temporal**

   Ensure that your Temporal server is running and accessible at the address specified in `TEMPORAL_ADDRESS`.

## Running the Application

### Development Mode

To start the application in development mode with hot-reloading:

```bash
npm run dev
```

This command compiles TypeScript files and starts the server using `nodemon` and `ts-node`. The server listens on `http://localhost:5000` by default.

**Running the Sample Worker**

In a separate terminal, start the Temporal worker:

```bash
npm run dev:worker-sample
```

### Production Mode

Build the application:

```bash
npm run build
```

Start the server:

```bash
npm start
```

**Running the Sample Worker**

In a separate terminal, start the built worker:

```bash
npm run start:worker-sample
```

## Docker Usage

To build and run the application using Docker:

1. **Build the Docker image**

   ```bash
   docker build -t temporal-web-api .
   ```

2. **Run the Docker container**

   ```bash
   docker run -p 5000:5000 temporal-web-api
   ```

   - The server will be accessible at `http://localhost:5000`.

## Usage

### Health Check

Verify if the service is running by accessing:

```
GET http://localhost:5000/api/health
```

**Response:**

```
Connection is healthy
```

### Start a Workflow

To start a workflow, send a `POST` request to `/api/workflow/start` with the workflow name and arguments.

**Endpoint:**

```
POST http://localhost:5000/api/workflow/start
```

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "name": "sampleWorkflow",
  "args": ["Hello, World!"]
}
```

**Sample Request using `curl`:**

```bash
curl -X POST http://localhost:5000/api/workflow/start \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "sampleWorkflow",
    "args": ["Hello, World!"]
  }'
```

**Response:**

```json
{
  "message": "Workflow sampleWorkflow started",
  "id": "sampleWorkflow-<uuid>"
}
```

### Get Workflow Status

To get the status of a workflow, send a `GET` request to `/api/workflow/status` with the `id`.

**Endpoint:**

```
GET http://localhost:5000/api/workflow/status?id=<workflow-id>
```

**Sample Request using `curl`:**

```bash
curl http://localhost:5000/api/workflow/status?id=sampleWorkflow-<uuid>
```

**Response:**

```json
{
  "message": "Status of workflow sampleWorkflow-<uuid>",
  "result": {
    "name": "Hello, World!"
  },
  "status": "COMPLETED",
  "queries": {
    "condition": "ok"
  }
}
```

## Project Structure

```
temporal-web-api/
├── src/
│   ├── controllers/
│   │   └── workflowController.ts    # Handles workflow API logic
│   ├── routers/
│   │   ├── index.ts                 # Main router
│   │   └── workflowRouter.ts        # Workflow routes
│   ├── services/
│   │   └── temporal.ts              # Temporal client and worker connections
│   ├── worker/
│   │   └── sample.ts                # Sample worker setup
│   ├── workflows/
│   │   ├── sample/
│   │   │   ├── activities.ts        # Sample activities
│   │   │   └── workflows.ts         # Sample workflow definitions
│   │   └── registry.ts              # Workflow registry
│   └── index.ts                     # Express server setup
├── assets/
│   └── sample/
│       ├── start.http               # Sample request to start a workflow
│       └── status.http              # Sample request to get workflow status
├── dist/                            # Compiled JavaScript files (after build)
├── .env                             # Environment variables (not committed)
├── .gitignore
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## Scripts

Available NPM scripts:

- **Build & Development:**
  - `npm run build` &mdash; Compiles TypeScript files to JavaScript.
  - `npm run dev` &mdash; Starts the development server with hot-reloading.
  - `npm run dev:worker-sample` &mdash; Starts the sample worker in development mode.
- **Production:**
  - `npm start` &mdash; Starts the server in production mode.
  - `npm run start:worker-sample` &mdash; Starts the sample worker in production mode.
- **Code Quality:**
  - `npm run format` &mdash; Formats the code using Prettier.
  - `npm run lint` &mdash; Lints the code using ESLint.
  - `npm run lint:fix` &mdash; Fixes linting errors.

## Dependencies

- **[@temporalio/client](https://www.npmjs.com/package/@temporalio/client)**
- **[@temporalio/worker](https://www.npmjs.com/package/@temporalio/worker)**
- **[@temporalio/workflow](https://www.npmjs.com/package/@temporalio/workflow)**
- **[Express](https://expressjs.com/)**
- **[dotenv](https://www.npmjs.com/package/dotenv)**
- **[cors](https://www.npmjs.com/package/cors)**
- **[config](https://www.npmjs.com/package/config)**
- **[TypeScript](https://www.typescriptlang.org/)**

## License

Licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.