import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  GroqAdapter,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import OpenAI from 'openai';
import { NextRequest } from 'next/server';

function getServiceAdapter() {
  // 1. Google Gemini (100% Free at Google AI Studio)
  if (process.env.GEMINI_API_KEY) {
    return new GoogleGenerativeAIAdapter({
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    });
  }

  // 2. Groq (100% Free at console.groq.com)
  if (process.env.GROQ_API_KEY) {
    return new OpenAIAdapter({
      openai: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      }),
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    });
  }

  // 3. OpenRouter (Free models at openrouter.ai)
  if (process.env.OPENROUTER_API_KEY) {
    return new OpenAIAdapter({
      openai: new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      }),
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
    });
  }

  // 4. Default: OpenAI
  return new OpenAIAdapter({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  });
}

export const POST = async (req: NextRequest) => {
  const serviceAdapter = getServiceAdapter();
  const runtime = new CopilotRuntime();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
};

export const GET = async (req: NextRequest) => {
  const serviceAdapter = getServiceAdapter();
  const runtime = new CopilotRuntime();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
};
