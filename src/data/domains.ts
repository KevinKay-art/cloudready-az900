import { ExamDomain } from '../types';

export const EXAM_DOMAINS: ExamDomain[] = [
  {
    id: 'domain_1',
    code: 'Part 1',
    title: 'Describe Cloud Concepts',
    shortTitle: 'Cloud Concepts',
    weight: '25–30%',
    approxPercentage: 28,
    description: 'Understand cloud computing fundamentals, cloud deployment models, shared responsibility, CapEx vs. OpEx, and cloud benefits.',
    color: 'sky',
  },
  {
    id: 'domain_2',
    code: 'Part 2',
    title: 'Describe Azure Architecture and Services',
    shortTitle: 'Architecture & Services',
    weight: '35–40%',
    approxPercentage: 37,
    description: 'Explore Azure geography (regions, availability zones), core compute, storage, networking, identity with Microsoft Entra ID, and management hierarchy.',
    color: 'blue',
  },
  {
    id: 'domain_3',
    code: 'Part 3',
    title: 'Describe Azure Management and Governance',
    shortTitle: 'Management & Governance',
    weight: '30–35%',
    approxPercentage: 35,
    description: 'Master cost estimation and management, governance tools (Azure Policy, locks, tags), monitoring services, compliance, and Azure Arc.',
    color: 'indigo',
  },
];
