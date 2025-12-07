import { type SchemaTypeDefinition } from 'sanity';
import blog from './blog';
import sermon from './sermon';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blog, sermon],
}
