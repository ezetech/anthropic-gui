import { models } from '@/models';

export const modelSelectItems = models.map(model => ({
  value: model.name,
}));
