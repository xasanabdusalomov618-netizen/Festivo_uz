import type { CategoryId } from '../types';
import type { IconName } from '../components/Icon';

export interface CategoryMeta {
  id: CategoryId;
  icon: IconName;
  /** css accent: 'red' | 'blue' alternates the brand colours across the strip */
  accent: 'red' | 'blue';
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'stul', icon: 'chair', accent: 'blue' },
  { id: 'stol', icon: 'table', accent: 'red' },
  { id: 'les', icon: 'lumber', accent: 'blue' },
  { id: 'mebel', icon: 'sofa', accent: 'red' },
  { id: 'qurilish', icon: 'brick', accent: 'blue' },
  { id: 'xizmat', icon: 'tools', accent: 'red' },
  { id: 'boshqa', icon: 'tag', accent: 'blue' },
];

export const categoryMeta = (id: CategoryId): CategoryMeta =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
