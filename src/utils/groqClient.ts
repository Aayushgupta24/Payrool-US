import axios from 'axios';

export interface GroqCompletionConfig {
  temperature?: number;
  max_completion_tokens?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string[] | null;
}

export class GroqClient {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly maxRetries: number = 3;
  private readonly retryDelay: number = 1000;

  constructor(apiKey: string = process.env.GROQ_API_KEY || '') {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.groq.com/openai/v1/chat/completions';
  }

  private async retryWithBackoff<T>(operation: () => Promise<T>): Promise<T> {
    let lastError;
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        console.error(`Attempt ${attempt + 1} failed:`, error.message);
        
        // Check if we should retry based on error type
        if (
          error.code === 'ECONNRESET' || 
          error.code === 'ECONNABORTED' ||
          error.code === 'ETIMEDOUT' ||
          (error.response && error.response.status >= 500)
        ) {
          const delay = this.retryDelay * Math.pow(2, attempt);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
    throw lastError;
  }

  async createStreamingCompletion(messages: any[], config: GroqCompletionConfig = {}) {
    const mergedConfig = {
      temperature: 0.7,
      max_completion_tokens: 2048,
      top_p: 1,
      stream: true,
      ...config
    };

    return this.retryWithBackoff(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages,
            ...mergedConfig
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }

        return response.body;
      } catch (error: any) {
        console.error('Streaming completion error:', error);
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    });
  }

  async createCompletion(messages: any[], config: GroqCompletionConfig = {}) {
    const defaultConfig = {
      temperature: 0.7,
      max_completion_tokens: 2048,
      top_p: 1,
      stream: false,
      ...config
    };

    return this.retryWithBackoff(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages,
            ...defaultConfig
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
        }

        return await response.json();
      } catch (error: any) {
        console.error('Completion error:', error);
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    });
  }
}




