export const models = [
  {
    name: 'claude-v1',
    description:
      'Our largest model, ideal for a wide range of more complex tasks.',
  },
  {
    name: 'claude-v1-100k',
    description:
      'An enhanced version of claude-v1 with a 100,000 token (roughly 75,000 word) context window. Ideal for summarizing, analyzing, and querying long documents and conversations for nuanced understanding of complex topics and relationships across very long spans of text.',
  },
  {
    name: 'claude-instant-v1',
    description:
      'A smaller model with far lower latency, sampling at roughly 40 words/sec! Its output quality is somewhat lower than the latest claude-v1 model, particularly for complex tasks. However, it is much less expensive and blazing fast. We believe that this model provides more than adequate performance on a range of tasks including text classification, summarization, and lightweight chat applications, as well as search result summarization.',
  },
  {
    name: 'claude-instant-v1-100k',
    description:
      'An enhanced version of claude-instant-v1 with a 100,000 token context window that retains its performance. Well-suited for high throughput use cases needing both speed and additional context, allowing deeper understanding from extended conversations and documents.',
  },
  {
    name: 'claude-v1.3',
    description:
      "Compared to claude-v1.2, it's more robust against red-team inputs, better at precise instruction-following, better at code, and better and non-English dialogue and writing.",
  },
  {
    name: 'claude-v1.3-100k',
    description:
      'An enhanced version of claude-v1.3 with a 100,000 token (roughly 75,000 word) context window.',
  },
  {
    name: 'claude-v1.2',
    description:
      'An improved version of claude-v1. It is slightly improved at general helpfulness, instruction following, coding, and other tasks. It is also considerably better with non-English languages. This model also has the ability to role play (in harmless ways) more consistently, and it defaults to writing somewhat longer and more thorough responses.',
  },
  {
    name: 'claude-v1.0',
    description: 'An earlier version of claude-v1.',
  },
  {
    name: 'claude-instant-v1.1',
    description:
      'Our latest version of claude-instant-v1. It is better than claude-instant-v1.0 at a wide variety of tasks including writing, coding, and instruction following. It performs better on academic benchmarks, including math, reading comprehension, and coding tests. It is also more robust against red-teaming inputs.',
  },
  {
    name: 'claude-instant-v1.1-100k',
    description:
      'An enhanced version of claude-instant-v1.1 with a 100,000 token context window that retains its lightning fast 40 word/sec performance.',
  },
  {
    name: 'claude-instant-v1.0',
    description: 'An earlier version of claude-instant-v1.',
  },
];
