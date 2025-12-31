# Light Code Executor

Isolated code execution service for Light Protocol documentation.

## Security Features

- API key authentication required
- Rate limiting (30 req/min)
- Code pattern blocking (no fs, child_process, eval, etc.)
- Execution timeout (30s)
- Output size limits (50KB)
- Memory limits (128MB heap)
- Runs as non-root user in Docker
- Read-only filesystem with tmpfs for execution

## Environment Variables

```bash
# Required: API key for authenticating requests
EXECUTOR_API_KEY=your-secure-api-key-here

# Optional: Port (default: 3040)
PORT=3040
```

## Local Development

```bash
cd code-executor

# Install dependencies
npm install

# Set environment variable
export EXECUTOR_API_KEY=dev-key-12345

# Run dev server
npm run dev
```

## Docker Deployment

### Build and Run

```bash
# Build image
docker build -t light-code-executor .

# Run container
docker run -d \
  --name code-executor \
  -p 3040:3040 \
  -e EXECUTOR_API_KEY=your-secure-key \
  --memory=512m \
  --cpus=0.5 \
  --read-only \
  --tmpfs /app/.temp:size=50M \
  --security-opt=no-new-privileges:true \
  light-code-executor
```

### Using Docker Compose

```bash
export EXECUTOR_API_KEY=your-secure-key
docker-compose up -d
```

## Deployment Options

### Railway

1. Connect your repo
2. Set `EXECUTOR_API_KEY` environment variable
3. Deploy

### Fly.io

```bash
fly launch
fly secrets set EXECUTOR_API_KEY=your-secure-key
fly deploy
```

### Render

1. Create new Web Service
2. Set environment variables
3. Deploy from Docker

## API

### Health Check

```
GET /health
Response: { "status": "ok" }
```

### Execute TypeScript

```
POST /typescript
Headers:
  Authorization: Bearer <EXECUTOR_API_KEY>
  Content-Type: application/json

Body:
  { "code": "console.log('Hello');" }

Response:
  { "stdout": "Hello", "stderr": "" }
```

## Integration with code-runner

The code-runner Next.js app proxies requests to this service. Configure:

```bash
# In code-runner environment
CODE_EXECUTOR_URL=https://your-executor-url.com
EXECUTOR_API_KEY=same-key-as-executor
```

