/**
 * Reddit Insights API Client
 */

import {
  RedditInsightsError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  APIError,
} from './errors';
import type {
  ClientOptions,
  SemanticSearchResponse,
  VectorSearchResponse,
  TrendsResponse,
  CreateSonarOptions,
} from './types';

export class RedditInsightsClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  private static readonly DEFAULT_BASE_URL = 'https://reddit-insights.com';

  constructor(options: ClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl || RedditInsightsClient.DEFAULT_BASE_URL).replace(/\/$/, '');
    this.timeout = options.timeout || 30000;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    options: {
      params?: Record<string, string | number>;
      body?: Record<string, unknown>;
    } = {}
  ): Promise<T> {
    let url = `${this.baseUrl}${endpoint}`;

    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'reddit-insights-js/1.0.0',
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof RedditInsightsError) throw error;
      throw new RedditInsightsError(`Request failed: ${(error as Error).message}`);
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    let data: Record<string, unknown>;
    try {
      data = await response.json();
    } catch {
      throw new APIError('Invalid JSON response', response.status);
    }

    if (response.status === 401) {
      throw new AuthenticationError(
        (data.error as string) || 'Authentication failed',
        data
      );
    } else if (response.status === 429) {
      throw new RateLimitError(
        (data.error as string) || 'Rate limit exceeded',
        data
      );
    } else if (response.status === 400) {
      throw new ValidationError(
        (data.error as string) || 'Validation error',
        data
      );
    } else if (response.status >= 400) {
      throw new APIError(
        (data.error as string) || 'API error',
        response.status,
        data
      );
    }

    return data as T;
  }

  async semanticSearch(
    query: string,
    limit: number = 20
  ): Promise<SemanticSearchResponse> {
    return this.request<SemanticSearchResponse>('POST', '/api/v1/search/semantic', {
      body: { query, limit },
    });
  }

  async vectorSearch(
    query: string,
    options: {
      limit?: number;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<VectorSearchResponse> {
    const body: Record<string, unknown> = { query, limit: options.limit || 30 };
    if (options.startDate) body.start_date = options.startDate;
    if (options.endDate) body.end_date = options.endDate;
    return this.request<VectorSearchResponse>('POST', '/api/v1/search/vector', { body });
  }

  async getTrends(options: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  } = {}): Promise<TrendsResponse> {
    const body: Record<string, unknown> = { limit: options.limit || 20 };
    if (options.startDate) body.start_date = options.startDate;
    if (options.endDate) body.end_date = options.endDate;
    return this.request<TrendsResponse>('POST', '/api/v1/trends', { body });
  }

  // Sonar Management (FREE endpoints)

  async listSonars(): Promise<Record<string, unknown>> {
    return this.request('GET', '/api/v1/sonars');
  }

  async createSonar(options: CreateSonarOptions): Promise<Record<string, unknown>> {
    return this.request('POST', '/api/v1/sonars', {
      body: {
        name: options.name,
        query: options.query,
        description: options.description,
        schedule: options.schedule || 'daily',
        triggers: options.triggers,
        notifyEmail: options.notifyEmail ?? true,
        notifySlack: options.notifySlack ?? false,
        slackWebhook: options.slackWebhook,
      },
    });
  }

  async getSonarExecutions(
    sonarId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<Record<string, unknown>> {
    return this.request('GET', `/api/v1/sonars/${sonarId}/executions`, {
      params: { limit: options.limit || 50, offset: options.offset || 0 },
    });
  }

  async getExecutionDetail(executionId: string): Promise<Record<string, unknown>> {
    return this.request('GET', `/api/v1/sonars/executions/${executionId}`);
  }
}

