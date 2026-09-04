import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import {
  BuiltInAgent,
  convertMessagesToVercelAISDKMessages,
  convertToolsToVercelAITools,
} from '@copilotkit/runtime/v2';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, stepCountIs } from 'ai';
import { NextRequest } from 'next/server';

/**
 * Returns the appropriate LanguageModel instance for CopilotKit BuiltInAgent.
 *
 * NOTE: For Groq and OpenAI-compatible providers, we explicitly use `.chat(modelId)`
 * instead of the default provider function. In @ai-sdk/openai v3, the default
 * calls the `/responses` endpoint (OpenAI Responses API), which Groq does not
 * support for multi-turn conversations with tool calls. Calling `.chat(modelId)`
 * targets `/chat/completions` directly, where multi-turn tool calling is fully supported.
 */
function getLanguageModel() {
  // 1. Google Gemini (Free at Google AI Studio: https://aistudio.google.com/)
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    });
    return google(process.env.GEMINI_MODEL || 'gemini-3.6-flash');
  }

  // 2. Groq (100% Free & Fast: https://console.groq.com/keys)
  if (process.env.GROQ_API_KEY) {
    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
    });
    return groq.chat(process.env.GROQ_MODEL || 'openai/gpt-oss-120b');
  }

  // 3. OpenRouter (Free community models: https://openrouter.ai/keys)
  if (process.env.OPENROUTER_API_KEY) {
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    return openrouter.chat(
      process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free'
    );
  }

  // 4. Default: OpenAI
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return openai.chat(process.env.OPENAI_MODEL || 'gpt-4o-mini');
}

// Endpoint handler using Factory Mode to avoid auto-injected state delta tools and provide custom system instructions
const getHandler = () => {
  const runtime = new CopilotRuntime({
    agents: () => ({
      default: new BuiltInAgent({
        type: 'aisdk',
        factory: ({ input, abortSignal }) => {
          const messages = convertMessagesToVercelAISDKMessages(input.messages);
          const tools = convertToolsToVercelAITools(input.tools);

          const contextParts: string[] = [];
          if (input.context && input.context.length > 0) {
            contextParts.push('## Current Application Context (User Tasks & Status):');
            for (const ctx of input.context) {
              contextParts.push(`${ctx.description}:\n${ctx.value}`);
            }
          }

          const systemPrompt = [
            'You are the AI assistant for TaskFlow, a modern task and todo manager.',
            'Help the user manage their tasks using the provided tools: addTask, updateTask, deleteTask, setTaskCompletion, rescheduleTask, filterTasks, and clearCompletedTasks.',
            'Always execute the appropriate tool when asked to add, modify, delete, reschedule, or complete tasks.',
            ...contextParts,
          ]
            .filter(Boolean)
            .join('\n\n');

          return streamText({
            model: getLanguageModel(),
            system: systemPrompt,
            messages,
            tools,
            abortSignal,
            stopWhen: stepCountIs(5),
          });
        },
      }),
    }),
  });

  return copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: '/api/copilotkit',
  });
};

export const POST = async (req: NextRequest) => {
  const { handleRequest } = getHandler();
  return handleRequest(req);
};

export const GET = async (req: NextRequest) => {
  const { handleRequest } = getHandler();
  return handleRequest(req);
};


