/**
 * Reddit Insights SDK Types
 */

export interface ClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  subreddit: string;
  upvotes: number;
  comments: number;
  created: string;
  relevance?: number;
  similarity_score?: number;
  sentiment?: string;
  url: string;
}

export interface SemanticSearchResponse {
  success: boolean;
  data?: {
    query: string;
    results: SearchResult[];
    total: number;
    processing_time_ms: number;
    ai_summary?: string;
  };
  error?: string;
}

export interface VectorSearchResponse {
  success: boolean;
  data?: {
    query: string;
    results: SearchResult[];
    total: number;
    processing_time_ms: number;
  };
  error?: string;
}

export interface TrendTopic {
  id: string;
  topic: string;
  post_count: number;
  total_upvotes: number;
  total_comments: number;
  avg_sentiment: number;
  top_subreddits: string[];
  trending_keywords: string[];
  sample_posts: Array<{
    id: string;
    title: string;
    subreddit: string;
    upvotes: number;
    comments: number;
    created: string;
  }>;
  trend_score: number;
  growth_rate: number;
}

export interface TrendsResponse {
  success: boolean;
  data?: {
    trends: TrendTopic[];
    total: number;
    date_range: {
      start: string;
      end: string;
    };
    processing_time_ms: number;
  };
  error?: string;
}

export interface Sonar {
  id: string;
  name: string;
  query: string;
  description?: string;
  enabled: boolean;
  schedule: string;
  lastExecutedAt?: string;
  nextExecutionAt?: string;
  createdAt: string;
}

export interface SonarExecution {
  id: string;
  status: string;
  executedAt: string;
  newPostsCount: number;
  triggered: boolean;
  triggerReason?: string;
  notificationSent: boolean;
  aiSummary?: string;
}

export interface CreateSonarOptions {
  name: string;
  query: string;
  description?: string;
  schedule?: 'hourly' | 'daily' | 'weekly';
  triggers?: {
    keywords?: string[];
    sentiment?: string;
    minNewPosts?: number;
  };
  notifyEmail?: boolean;
  notifySlack?: boolean;
  slackWebhook?: string;
}

