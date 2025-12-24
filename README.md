# Reddit Insights JavaScript SDK

Official JavaScript/TypeScript SDK for the Reddit Insights API. Analyze Reddit conversations with AI-powered semantic search.

## Installation

```bash
npm install reddit-insights
# or
yarn add reddit-insights
# or
pnpm add reddit-insights
```

## Quick Start

```typescript
import { RedditInsightsClient } from 'reddit-insights';

// Initialize the client
const client = new RedditInsightsClient({
  apiKey: 'YOUR_API_KEY',
});

// Semantic search
const results = await client.semanticSearch(
  'What do young people complain about banking apps?',
  20
);
console.log(results);

// Vector search with date filters
const vectorResults = await client.vectorSearch('electric vehicle charging', {
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  limit: 30,
});

// Get trending topics
const trends = await client.getTrends({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  limit: 20,
});
```

## Sonar Management (FREE Endpoints)

Sonars allow you to monitor Reddit conversations and receive alerts.

```typescript
// List all sonars
const sonars = await client.listSonars();

// Create a new sonar
const sonar = await client.createSonar({
  name: 'Product Feedback Monitor',
  query: 'What do users think about our product?',
  description: 'Track product feedback',
  schedule: 'daily',
  triggers: {
    keywords: ['bug', 'issue', 'problem'],
    sentiment: 'negative',
    minNewPosts: 5,
  },
  notifyEmail: true,
});

// Get sonar execution history
const executions = await client.getSonarExecutions('sonar_123', {
  limit: 50,
});

// Get detailed execution results
const detail = await client.getExecutionDetail('exec_789');
```

## API Reference

### Constructor Options

```typescript
interface ClientOptions {
  apiKey: string;
  baseUrl?: string; // Default: 'https://reddit-insights.com'
  timeout?: number; // Default: 30000 (ms)
}
```

### Methods

| Method | Description | Quota |
|--------|-------------|-------|
| `semanticSearch(query, limit)` | AI-powered semantic search | Uses quota |
| `vectorSearch(query, options)` | Vector similarity search | Uses quota |
| `getTrends(options)` | Get trending topics | Uses quota |
| `listSonars()` | List all sonars | FREE |
| `createSonar(options)` | Create a new sonar | FREE |
| `getSonarExecutions(sonarId, options)` | Get execution history | FREE |
| `getExecutionDetail(executionId)` | Get execution details | FREE |

## Error Handling

```typescript
import {
  RedditInsightsClient,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  APIError,
} from 'reddit-insights';

const client = new RedditInsightsClient({ apiKey: 'YOUR_API_KEY' });

try {
  const results = await client.semanticSearch('test query');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.log('Rate limit exceeded');
  } else if (error instanceof ValidationError) {
    console.log('Invalid request:', error.message);
  } else if (error instanceof APIError) {
    console.log('API error:', error.message);
  }
}
```

## Rate Limits

| Tier | Limit |
|------|-------|
| Free | 100 requests/hour |
| Pro | 10,000 requests/month |
| Enterprise | Unlimited |

## License

MIT License

## Support

For support, please visit https://reddit-insights.com or contact support@reddit-insights.com.

