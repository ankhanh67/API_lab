export type ApiTechnologyId =
  | 'rest'
  | 'soap'
  | 'graphql'
  | 'grpc'
  | 'websocket'
  | 'webhook'
  | 'openapi';

export type TechnicalNature =
  | 'Architectural Style'
  | 'Messaging Protocol'
  | 'Query Language & Runtime'
  | 'RPC Framework'
  | 'Communication Protocol'
  | 'Event-Driven Callback Mechanism'
  | 'API Description Specification';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface SimulatedApiRequest {
  method: HttpMethod | string;
  endpoint: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body: string;
  protocol: ApiTechnologyId;
  timestamp: string;
}

export interface SimulatedApiResponse {
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  latencyMs: number;
  explanationVi: string;
  isError: boolean;
  stepsTrace: string[];
}

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed' | 'error';

export type UniversalStepComponent = 'client' | 'api-layer' | 'server' | 'database';

export interface UniversalLifecycleStep {
  stepNumber: number;
  titleEn: string;
  titleVi: string;
  activeComponent: UniversalStepComponent;
  targetComponent?: UniversalStepComponent;
  direction: 'request' | 'internal' | 'response';
  shortExplanationVi: string;
  technicalMechanismVi: string;
  communicationState: string;
  payloadSnapshot: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  sublabel: string;
  role: 'client' | 'gateway' | 'server' | 'database' | 'broker' | 'contract';
  descriptionVi: string;
  techDetails: string;
}

export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  protocol: string;
  bidirectional?: boolean;
}

export interface CommunicationEvent {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  direction: 'outbound' | 'inbound' | 'bidirectional' | 'internal';
  protocol: string;
  summary: string;
  payload: string;
  status: 'success' | 'pending' | 'error' | 'retry';
  explanationVi: string;
}

export type QuizQuestionType =
  | 'multiple-choice'
  | 'technical-understanding'
  | 'scenario-based';

export interface QuizOption {
  id: string;
  textVi: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  moduleId: ApiTechnologyId | 'fundamentals' | 'comprehensive';
  type: QuizQuestionType;
  questionVi: string;
  codeContext?: string;
  options: QuizOption[];
  explanationVi: string;
  recommendationVi: string;
}

export interface CoreConceptItem {
  termEn: string;
  titleVi: string;
  summaryVi: string;
  deepDiveVi: string;
  codeSnippet?: string;
}

export interface CommunicationStage {
  step: number;
  actor: string;
  actionEn: string;
  descriptionVi: string;
  payloadExample: string;
}

export interface CodeExampleBlock {
  titleVi: string;
  language: string;
  descriptionVi: string;
  code: string;
  annotations: {
    lineHint: string;
    explanationVi: string;
  }[];
}

export interface UseCaseItem {
  titleVi: string;
  industry: string;
  descriptionVi: string;
  whyItFitsVi: string;
}

export interface RelatedTechComparison {
  comparedWith: string;
  keyDifferenceVi: string;
  whenToChooseThisVi: string;
  whenToChooseOtherVi: string;
}

export interface MisconceptionItem {
  mythVi: string;
  realityVi: string;
  technicalProofVi: string;
}

export interface LearningModule {
  id: ApiTechnologyId;
  order: number;
  name: string;
  taglineVi: string;
  technicalNature: TechnicalNature;
  technicalNatureVi: string;
  accentColor: string;
  badgeClass: string;
  borderClass: string;
  glowClass: string;
  introduction: {
    hookVi: string;
    problemSolvedVi: string;
    historicalContextVi: string;
    coexistenceNoteVi: string;
  };
  coreConcepts: CoreConceptItem[];
  architecture: {
    summaryVi: string;
    nodes: DiagramNode[];
    edges: DiagramEdge[];
  };
  howItWorks: {
    overviewVi: string;
    internalMechanismVi: string[];
  };
  communicationFlow: CommunicationStage[];
  practicalExample: {
    scenarioTitleVi: string;
    scenarioDescriptionVi: string;
    codeExamples: CodeExampleBlock[];
  };
  useCases: UseCaseItem[];
  WhenNotToUseVi: string[];
  advantages: string[];
  limitations: string[];
  relatedComparisons: RelatedTechComparison[];
  misconceptions: MisconceptionItem[];
}

export interface ScenarioArchitectureNode {
  id: string;
  name: string;
  role: string;
  techUsed: string;
  descriptionVi: string;
}

export interface ScenarioSimulationStep {
  step: number;
  fromNodeId: string;
  toNodeId: string;
  techId: ApiTechnologyId;
  actionLabel: string;
  payload: string;
  explanationVi: string;
}

export interface RealWorldScenario {
  id: string;
  number: number;
  titleEn: string;
  titleVi: string;
  subtitleVi: string;
  technologies: ApiTechnologyId[];
  businessProblemVi: string;
  whyTheseTechnologiesVi: {
    techId: ApiTechnologyId;
    reasonVi: string;
  }[];
  nodes: ScenarioArchitectureNode[];
  simulationSteps: ScenarioSimulationStep[];
  tradeOffsVi: string[];
}

export interface ComparisonRow {
  dimensionEn: string;
  dimensionVi: string;
  whatItMeansVi: string;
  values: Record<ApiTechnologyId, string>;
}
