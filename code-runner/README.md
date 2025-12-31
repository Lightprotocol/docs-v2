# Light Protocol Code Runner

Interactive code execution frontend for Light Protocol documentation.

## Architecture

```
┌─────────────────────┐     ┌─────────────────────┐
│   Mintlify Docs     │     │    Code Executor    │
│   (iframe embed)    │     │    (Docker/Cloud)   │
└─────────┬───────────┘     └──────────▲──────────┘
          │                            │
          ▼                            │
┌─────────────────────┐                │
│    Code Runner      │────────────────┘
│    (Next.js)        │   POST /typescript
│    /api/run         │   + Bearer auth
└─────────────────────┘
```

## Environment Variables

```bash
# Required: URL of the code executor service
CODE_EXECUTOR_URL=http://localhost:3040

# Required: API key to authenticate with executor
EXECUTOR_API_KEY=your-secure-api-key-here
```

## Local Development

```bash
cd code-runner

# Install dependencies
npm install

# Set environment variables (create .env.local)
echo "CODE_EXECUTOR_URL=http://localhost:3040" > .env.local
echo "EXECUTOR_API_KEY=dev-key-12345" >> .env.local

# Start the executor service first (in another terminal)
cd ../code-executor && npm run dev

# Run the code runner
npm run dev
```

Visit `http://localhost:3030/embed/create-mint`

## Adding New Examples

1. Create page in `src/app/embed/[example-name]/page.tsx`
2. Define code tabs
3. Embed in Mintlify docs via iframe

```tsx
import { CodeRunner } from "@/components/code-runner";

const tabs = [
  { title: "Action", code: "...", language: "typescript" },
];

export default function MyEmbed() {
  return <CodeRunner tabs={tabs} className="h-full" />;
}
```

## Deployment

### Vercel

1. Connect repo
2. Set root directory to `code-runner`
3. Add environment variables:
   - `CODE_EXECUTOR_URL` - URL of deployed executor
   - `EXECUTOR_API_KEY` - Matching API key

### Environment for Mintlify

Update the snippet to use production URL:

```jsx
// snippets/jsx/code-runner-embed.jsx
const baseUrl = "https://your-code-runner.vercel.app";
```
