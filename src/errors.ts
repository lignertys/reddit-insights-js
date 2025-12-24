/**
 * Reddit Insights SDK Errors
 */

export class RedditInsightsError extends Error {
  public statusCode?: number;
  public response?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode?: number,
    response?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'RedditInsightsError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class AuthenticationError extends RedditInsightsError {
  constructor(message: string, response?: Record<string, unknown>) {
    super(message, 401, response);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends RedditInsightsError {
  constructor(message: string, response?: Record<string, unknown>) {
    super(message, 429, response);
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends RedditInsightsError {
  constructor(message: string, response?: Record<string, unknown>) {
    super(message, 400, response);
    this.name = 'ValidationError';
  }
}

export class APIError extends RedditInsightsError {
  constructor(
    message: string,
    statusCode?: number,
    response?: Record<string, unknown>
  ) {
    super(message, statusCode, response);
    this.name = 'APIError';
  }
}

