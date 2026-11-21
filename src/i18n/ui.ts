import { Language } from '@/config/site';

export interface UiDictionary {
  nav: {
    subtitle: string;
    overview: string;
    fundamentals: string;
    modulesBtn: string;
    modulesDropdownHeader: string;
    lab: string;
    scenarios: string;
    comparison: string;
    assessment: string;
    langLabel: string;
    themeLight: string;
    themeDark: string;
    mobileModulesHeader: string;
  };
  footer: {
    learningModules: string;
    practiceAndAssessment: string;
    fundamentalsLink: string;
    labLink: string;
    scenariosLink: string;
    comparisonLink: string;
    assessmentLink: string;
    copyright: string;
  };
  common: {
    exploreModule: string;
    openPlayground: string;
    openLab: string;
    runSimulation: string;
    reset: string;
    step: string;
    pause: string;
    resume: string;
    start: string;
    status: string;
    latency: string;
    protocol: string;
    requestPayload: string;
    responsePayload: string;
    technicalExplanation: string;
  };
}

export const UI_TEXT: Record<Language, UiDictionary> = {
  vi: {
    nav: {
      subtitle: 'Mô phỏng Kiến trúc & Giao thức API Tương tác',
      overview: 'Tổng quan',
      fundamentals: 'Nền tảng API',
      modulesBtn: '7 Công nghệ API',
      modulesDropdownHeader: '7 Chuyên đề & Phân loại kỹ thuật',
      lab: 'API Laboratory',
      scenarios: 'Kiến trúc Thực tế',
      comparison: 'So sánh',
      assessment: 'Kiểm tra',
      langLabel: 'Ngôn ngữ',
      themeLight: 'Sáng',
      themeDark: 'Tối',
      mobileModulesHeader: '7 Chuyên đề Công nghệ API',
    },
    footer: {
      learningModules: '7 Chuyên đề Học tập',
      practiceAndAssessment: 'Thực hành & Đánh giá',
      fundamentalsLink: 'Kiến thức Nền tảng API (Fundamentals)',
      labLink: 'Phòng thí nghiệm Mô phỏng (Interactive API Lab)',
      scenariosLink: 'Kịch bản Kiến trúc Thực tế (Real-World Scenarios)',
      comparisonLink: 'Trung tâm Đối chiếu & So sánh (Comparison Center)',
      assessmentLink: 'Kiểm tra Đánh giá Năng lực (Knowledge Check)',
      copyright:
        'Xây dựng cho mục đích giáo dục Kỹ thuật Phần mềm & Khoa học Máy tính.',
    },
    common: {
      exploreModule: 'Học chuyên đề này',
      openPlayground: 'Mở Playground',
      openLab: 'Mở Phòng thí nghiệm',
      runSimulation: 'Thực thi mô phỏng',
      reset: 'Đặt lại',
      step: 'Từng bước',
      pause: 'Tạm dừng',
      resume: 'Tiếp tục',
      start: 'Bắt đầu',
      status: 'Trạng thái',
      latency: 'Độ trễ',
      protocol: 'Giao thức',
      requestPayload: 'Gói tin Yêu cầu (Request)',
      responsePayload: 'Gói tin Phản hồi (Response)',
      technicalExplanation: 'Giải thích cơ chế kỹ thuật',
    },
  },
  en: {
    nav: {
      subtitle: 'Interactive Architecture & Protocol Simulator',
      overview: 'Overview',
      fundamentals: 'API Fundamentals',
      modulesBtn: '7 API Technologies',
      modulesDropdownHeader: '7 Modules & Technical Classification',
      lab: 'API Laboratory',
      scenarios: 'Real-World Systems',
      comparison: 'Comparison',
      assessment: 'Assessment',
      langLabel: 'Language',
      themeLight: 'Light',
      themeDark: 'Dark',
      mobileModulesHeader: '7 API Technology Modules',
    },
    footer: {
      learningModules: '7 Learning Modules',
      practiceAndAssessment: 'Practice & Assessment',
      fundamentalsLink: 'API Core Fundamentals',
      labLink: 'Interactive API Laboratory (8-Step Simulator)',
      scenariosLink: 'Real-World Architecture Scenarios',
      comparisonLink: '9-Dimension Comparison Center',
      assessmentLink: 'Competency & Knowledge Check',
      copyright:
        'Engineered for Software Engineering & Computer Science education.',
    },
    common: {
      exploreModule: 'Explore Module',
      openPlayground: 'Open Playground',
      openLab: 'Open API Lab',
      runSimulation: 'Execute Simulation',
      reset: 'Reset',
      step: 'Step Forward',
      pause: 'Pause',
      resume: 'Resume',
      start: 'Start',
      status: 'Status',
      latency: 'Latency',
      protocol: 'Protocol',
      requestPayload: 'Request Payload',
      responsePayload: 'Response Payload',
      technicalExplanation: 'Technical Mechanism Explanation',
    },
  },
};

export function getUiText(lang: Language): UiDictionary {
  return UI_TEXT[lang];
}
