import { CopilotRuntime, GroqAdapter } from "@copilotkit/runtime";
import { Groq } from "groq-sdk";

// Configuration interface
export interface GroqConfig {
  apiKey: string;
  model: string;
  disableParallelToolCalls?: boolean;
}

// Default configuration
const defaultConfig: GroqConfig = {
  apiKey: process.env.GROQ_API_KEY || '',
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
  disableParallelToolCalls: false,
};

// Create singleton instance
class GroqInstance {
  private static instance: GroqInstance;
  private groq: Groq;
  private adapter: GroqAdapter;
  private runtime: CopilotRuntime;

  private constructor(config: GroqConfig = defaultConfig) {
    this.groq = new Groq({ apiKey: config.apiKey });
    this.adapter = new GroqAdapter({
      groq: this.groq,
      model: config.model,
      disableParallelToolCalls: config.disableParallelToolCalls
    });
    this.runtime = new CopilotRuntime();
  }

  public static getInstance(config?: GroqConfig): GroqInstance {
    if (!GroqInstance.instance) {
      GroqInstance.instance = new GroqInstance(config);
    }
    return GroqInstance.instance;
  }

  public getGroq(): Groq {
    return this.groq;
  }

  public getAdapter(): GroqAdapter {
    return this.adapter;
  }

  public getRuntime(): CopilotRuntime {
    return this.runtime;
  }
}

export const groqInstance = GroqInstance.getInstance();
export const groq = groqInstance.getGroq();
export const groqAdapter = groqInstance.getAdapter();
export const copilotRuntime = groqInstance.getRuntime();