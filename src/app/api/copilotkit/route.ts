import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import OpenAI from 'openai';
import { NextRequest } from 'next/server';

/**
 * Custom fetch wrapper to sanitize outgoing payloads for Groq API.
 * Groq strictly requires `content` to be a string (rejects array parts),
 * normalizes 'developer' role to 'system', and strips unsupported fields like reasoning.
 */
const createGroqFetch = (): typeof fetch => {
  return async (url, init) => {
    let bodyJson: any = null;
    if (init && init.body) {
      try {
        bodyJson = JSON.parse(init.body as string);
      } catch (e) {}
    }

    if (bodyJson) {
      // 1. Groq uses max_tokens instead of max_completion_tokens
      if ('max_completion_tokens' in bodyJson) {
        bodyJson.max_tokens = bodyJson.max_completion_tokens;
        delete bodyJson.max_completion_tokens;
      }

      // 2. Sanitize message history
      if (Array.isArray(bodyJson.messages)) {
        bodyJson.messages = bodyJson.messages.map((msg: any) => {
          const clean: any = { ...msg };

          // Normalize 'developer' role to 'system'
          if (clean.role === 'developer') {
            clean.role = 'system';
          }

          // Groq requires `content` to be a string
          if (Array.isArray(clean.content)) {
            clean.content = clean.content
              .map((p: any) => (typeof p === 'string' ? p : p?.text || ''))
              .filter(Boolean)
              .join('\n');
          } else if (clean.content === null || clean.content === undefined) {
            if (!clean.tool_calls) {
              clean.content = '';
            }
          }

          // Tool results must have string content
          if (clean.role === 'tool' && typeof clean.content !== 'string') {
            clean.content =
              typeof clean.content === 'object'
                ? JSON.stringify(clean.content)
                : String(clean.content ?? '');
          }

          // Ensure tool_calls arguments are serialized JSON strings
          if (Array.isArray(clean.tool_calls)) {
            clean.tool_calls = clean.tool_calls.map((tc: any) => ({
              id: tc.id || `call_${Date.now()}`,
              type: 'function',
              function: {
                name: tc.function?.name || '',
                arguments:
                  typeof tc.function?.arguments === 'object'
                    ? JSON.stringify(tc.function.arguments)
                    : String(tc.function?.arguments || '{}'),
              },
            }));
          }

          // Strip unsupported metadata/reasoning fields that trigger Groq 400s
          delete clean.reasoning;
          delete clean.reasoning_content;
          delete clean.thought;
          delete clean.thoughtSignature;

          return clean;
        });
      }

      init = {
        ...init,
        body: JSON.stringify(bodyJson),
      };
    }

    const response = await fetch(url, init);

    if (!response.ok) {
      const errorText = await response.clone().text();
      console.error('[Groq API Error]:', response.status, errorText);
    }

    return response;
  };
};

function getServiceAdapter() {
  // 1. Google Gemini (100% Free at Google AI Studio)
  if (process.env.GEMINI_API_KEY) {
    return new GoogleGenerativeAIAdapter({
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    });
  }

  // 2. Groq (with custom sanitizer for multi-turn conversations)
  if (process.env.GROQ_API_KEY) {
    return new OpenAIAdapter({
      openai: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
        fetch: createGroqFetch(),
      }),
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      keepSystemRole: true,
      disableParallelToolCalls: true,
    });
  }

  // 3. OpenRouter (Free models)
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
