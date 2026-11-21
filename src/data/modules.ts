import { ApiTechnologyId, LearningModule } from '@/types/api';
import { Language } from '@/config/site';
import { MODULES_PART_1 } from './modulesPart1';
import { MODULES_PART_2 } from './modulesPart2';
import { MODULES_PART_1_EN } from './en/modulesPart1';
import { MODULES_PART_2_EN } from './en/modulesPart2';

export const ALL_LEARNING_MODULES: LearningModule[] = [
  ...MODULES_PART_1,
  ...MODULES_PART_2,
];

export const ALL_LEARNING_MODULES_EN: LearningModule[] = [
  ...MODULES_PART_1_EN,
  ...MODULES_PART_2_EN,
];

export function getApiModulesList(lang: Language = 'vi'): LearningModule[] {
  return lang === 'en' ? ALL_LEARNING_MODULES_EN : ALL_LEARNING_MODULES;
}

export function getModuleById(
  id: string,
  lang: Language = 'vi'
): LearningModule | undefined {
  const list = getApiModulesList(lang);
  return list.find((m) => m.id === (id as ApiTechnologyId));
}
