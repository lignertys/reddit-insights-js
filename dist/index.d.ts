/**
 * Reddit Insights SDK Types
 */
interface ClientOptions {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
}
interface SearchResult {
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
interface SemanticSearchResponse {
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
interface VectorSearchResponse {
    success: boolean;
    data?: {
        query: string;
        results: SearchResult[];
        total: number;
        processing_time_ms: number;
    };
    error?: string;
}
interface TrendTopic {
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
interface TrendsResponse {
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
interface Sonar {
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
interface SonarExecution {
    id: string;
    status: string;
    executedAt: string;
    newPostsCount: number;
    triggered: boolean;
    triggerReason?: string;
    notificationSent: boolean;
    aiSummary?: string;
}
interface CreateSonarOptions {
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

/**
 * Reddit Insights API Client
 */

declare class RedditInsightsClient {
    private apiKey;
    private baseUrl;
    private timeout;
    private static readonly DEFAULT_BASE_URL;
    constructor(options: ClientOptions);
    private request;
    private handleResponse;
    semanticSearch(query: string, limit?: number): Promise<SemanticSearchResponse>;
    vectorSearch(query: string, options?: {
        limit?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<VectorSearchResponse>;
    getTrends(options?: {
        startDate?: string;
        endDate?: string;
        limit?: number;
    }): Promise<TrendsResponse>;
    listSonars(): Promise<Record<string, unknown>>;
    createSonar(options: CreateSonarOptions): Promise<Record<string, unknown>>;
    getSonarExecutions(sonarId: string, options?: {
        limit?: number;
        offset?: number;
    }): Promise<Record<string, unknown>>;
    getExecutionDetail(executionId: string): Promise<Record<string, unknown>>;
}

/**
 * Reddit Insights SDK Errors
 */
declare class RedditInsightsError extends Error {
    statusCode?: number;
    response?: Record<string, unknown>;
    constructor(message: string, statusCode?: number, response?: Record<string, unknown>);
}
declare class AuthenticationError extends RedditInsightsError {
    constructor(message: string, response?: Record<string, unknown>);
}
declare class RateLimitError extends RedditInsightsError {
    constructor(message: string, response?: Record<string, unknown>);
}
declare class ValidationError extends RedditInsightsError {
    constructor(message: string, response?: Record<string, unknown>);
}
declare class APIError extends RedditInsightsError {
    constructor(message: string, statusCode?: number, response?: Record<string, unknown>);
}

export { APIError, AuthenticationError, type ClientOptions, type CreateSonarOptions, RateLimitError, RedditInsightsClient, RedditInsightsError, type SearchResult, type SemanticSearchResponse, type Sonar, type SonarExecution, type TrendTopic, type TrendsResponse, ValidationError, type VectorSearchResponse };
