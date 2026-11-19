import { ApiTechnologyId, LearningModule } from '@/types/api';
import { MODULES_PART_1 } from './modulesPart1';
import { MODULES_PART_2 } from './modulesPart2';

export const ALL_LEARNING_MODULES: LearningModule[] = [
  ...MODULES_PART_1,
  ...MODULES_PART_2,
];

export function getModuleById(id: string): LearningModule | undefined {
  return ALL_LEARNING_MODULES.find((m) => m.id === (id as ApiTechnologyId));
}
