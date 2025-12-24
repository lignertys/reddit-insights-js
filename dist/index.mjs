// src/errors.ts
var RedditInsightsError = class extends Error {
  constructor(message, statusCode, response) {
    super(message);
    this.name = "RedditInsightsError";
    this.statusCode = statusCode;
    this.response = response;
  }
};
var AuthenticationError = class extends RedditInsightsError {
  constructor(message, response) {
    super(message, 401, response);
    this.name = "AuthenticationError";
  }
};
var RateLimitError = class extends RedditInsightsError {
  constructor(message, response) {
    super(message, 429, response);
    this.name = "RateLimitError";
  }
};
var ValidationError = class extends RedditInsightsError {
  constructor(message, response) {
    super(message, 400, response);
    this.name = "ValidationError";
  }
};
var APIError = class extends RedditInsightsError {
  constructor(message, statusCode, response) {
    super(message, statusCode, response);
    this.name = "APIError";
  }
};

// src/client.ts
var _RedditInsightsClient = class _RedditInsightsClient {
  constructor(options) {
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl || _RedditInsightsClient.DEFAULT_BASE_URL).replace(/\/$/, "");
    this.timeout = options.timeout || 3e4;
  }
  async request(method, endpoint, options = {}) {
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
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "reddit-insights-js/1.0.0"
        },
        body: options.body ? JSON.stringify(options.body) : void 0,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof RedditInsightsError) throw error;
      throw new RedditInsightsError(`Request failed: ${error.message}`);
    }
  }
  async handleResponse(response) {
    let data;
    try {
      data = await response.json();
    } catch {
      throw new APIError("Invalid JSON response", response.status);
    }
    if (response.status === 401) {
      throw new AuthenticationError(
        data.error || "Authentication failed",
        data
      );
    } else if (response.status === 429) {
      throw new RateLimitError(
        data.error || "Rate limit exceeded",
        data
      );
    } else if (response.status === 400) {
      throw new ValidationError(
        data.error || "Validation error",
        data
      );
    } else if (response.status >= 400) {
      throw new APIError(
        data.error || "API error",
        response.status,
        data
      );
    }
    return data;
  }
  async semanticSearch(query, limit = 20) {
    return this.request("POST", "/api/v1/search/semantic", {
      body: { query, limit }
    });
  }
  async vectorSearch(query, options = {}) {
    const body = { query, limit: options.limit || 30 };
    if (options.startDate) body.start_date = options.startDate;
    if (options.endDate) body.end_date = options.endDate;
    return this.request("POST", "/api/v1/search/vector", { body });
  }
  async getTrends(options = {}) {
    const body = { limit: options.limit || 20 };
    if (options.startDate) body.start_date = options.startDate;
    if (options.endDate) body.end_date = options.endDate;
    return this.request("POST", "/api/v1/trends", { body });
  }
  // Sonar Management (FREE endpoints)
  async listSonars() {
    return this.request("GET", "/api/v1/sonars");
  }
  async createSonar(options) {
    return this.request("POST", "/api/v1/sonars", {
      body: {
        name: options.name,
        query: options.query,
        description: options.description,
        schedule: options.schedule || "daily",
        triggers: options.triggers,
        notifyEmail: options.notifyEmail ?? true,
        notifySlack: options.notifySlack ?? false,
        slackWebhook: options.slackWebhook
      }
    });
  }
  async getSonarExecutions(sonarId, options = {}) {
    return this.request("GET", `/api/v1/sonars/${sonarId}/executions`, {
      params: { limit: options.limit || 50, offset: options.offset || 0 }
    });
  }
  async getExecutionDetail(executionId) {
    return this.request("GET", `/api/v1/sonars/executions/${executionId}`);
  }
};
_RedditInsightsClient.DEFAULT_BASE_URL = "https://reddit-insights.com";
var RedditInsightsClient = _RedditInsightsClient;
export {
  APIError,
  AuthenticationError,
  RateLimitError,
  RedditInsightsClient,
  RedditInsightsError,
  ValidationError
};
