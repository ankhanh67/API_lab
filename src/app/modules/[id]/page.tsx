import React from 'react';
import { notFound } from 'next/navigation';
import { ALL_LEARNING_MODULES, getModuleById } from '@/data/modules';
import { getQuestionsByModule } from '@/data/quizzes';
import { ModuleDetailClient } from '@/components/modules/ModuleDetailClient';

export function generateStaticParams() {
  return ALL_LEARNING_MODULES.map((m) => ({
    id: m.id,
  }));
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const moduleData = getModuleById(resolvedParams.id);

  if (!moduleData) {
    notFound();
  }

  const moduleQuizzes = getQuestionsByModule(moduleData.id);

  return (
    <ModuleDetailClient
      moduleData={moduleData}
      moduleQuizzes={moduleQuizzes}
    />
  );
}
