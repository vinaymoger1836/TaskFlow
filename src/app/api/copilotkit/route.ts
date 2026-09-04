import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { NextRequest } from 'next/server';

function getServiceAdapter() {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    return new GoogleGenerativeAIAdapter({
      apiKey: geminiKey,
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    });
  }

  // Fallback to OpenAI if OPENAI_API_KEY is provided
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
