import { ANTHROPIC_CONFIG } from '@/api/config';
import { ApiSettingOptions } from '@/typings/common';

export interface PromptRequest extends ApiSettingOptions {
  prompt: string;
}

export const submitPropmt = async ({
  model,
  temperature,
  topK,
  topP,
  apiKey,
  maxTokens,
  prompt,
}: PromptRequest) => {
  const requestBody = {
    prompt: `\n\nHuman: ${prompt}\n\nAssistant: `,
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
    },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(
      `${ANTHROPIC_CONFIG.anthropicApiPrefix}/complete`,
      requestOptions,
    );

    return response;
  } catch (error) {
    console.log(error); // TODO remove
  }
};
