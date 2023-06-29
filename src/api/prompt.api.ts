import { ANTHROPIC_CONFIG } from '@/api/config';
import { ApiSettingOptions } from '@/typings/common';

export interface PromptRequest extends ApiSettingOptions {
  prompt: string;
  signal?: AbortSignal;
}

export const submitPrompt = async ({
  model,
  temperature,
  topK,
  topP,
  apiKey,
  maxTokens,
  prompt,
  signal,
}: PromptRequest) => {
  const requestBody = {
    prompt,
    model,
    temperature,
    top_k: topK,
    top_p: topP,
    max_tokens_to_sample: maxTokens,
    stop_sequences: ['\n\nHuman:'],
    stream: true,
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    signal: signal,
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(
      `${ANTHROPIC_CONFIG.anthropicApiPrefix}/complete`,
      requestOptions,
    );

    return response;
  } catch (error) {
    console.error(error); // TODO show error message
  }
};
