
export type LLMProvider = 'openai' | 'deepseek' | 'anthropic' | 'cohere' | 'azure';

export interface Configs {
  loginUrl: string;
  username: string;
  password: string;
  targetUrl: string;
  openaiApiKey: string;
  openaiBaseURL?: string;
  llmProvider?: LLMProvider;
  azureEndpoint?: string;
  azureModelName?: string;
}

export interface Configs {
  loginUrl: string;
  username: string;
  password: string;
  targetUrl: string;
  openaiApiKey: string;
  openaiBaseURL?: string;
}

export interface ElementProperties {
    tag: string;
    id: string | null;
    classes: string | null;
    type: string | null;
    name: string | null;
    dataTestId: string | null;
    value: string | null;
    placeholder: string | null;
    ariaLabel: string | null;
    role: string | null;
  }

export interface ElementInfo {
  tag: string;
  type: string;
  name: string;
  id: string;
  class: string;
  dataTestId: string;
  cssSelector: string;
  playwrightSelector: string;
  description: string;
  aiValidation: string;
}