import { ApiSettingOptions } from '@/typings/common';

import { baseApi } from '../api';

export interface PromptRequest extends ApiSettingOptions {
  prompt: string;
}

export const promptApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    submitPrompt: builder.mutation<ReadableStream<Uint8Array>, PromptRequest>({
      query: ({
        model,
        apiKey,
        maxTokens,
        temperature,
        topK,
        topP,
        prompt,
      }) => ({
        url: '/complete',
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: {
          prompt: `\n\nHuman: ${prompt}\n\nAssistant: `,
          model,
          temperature,
          top_k: topK,
          top_p: topP,
          max_tokens_to_sample: maxTokens,
          stop_sequences: ['\n\nHuman:'],
          stream: true,
        },
      }),
    }),
  }),
});

export const { useSubmitPromptMutation } = promptApi;
