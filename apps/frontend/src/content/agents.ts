export type AgentMode = 'strict' | 'flexible';

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  mode: AgentMode;
  color: 'lavender' | 'mint' | 'peach' | 'sky' | 'rose' | 'amber';
}

export const agents: Agent[] = [
  {
    id: '1',
    name: 'Startup Mentor',
    description: 'Strategic guidance for founders navigating early-stage challenges and growth decisions.',
    icon: 'Rocket',
    mode: 'flexible',
    color: 'lavender',
  },
  {
    id: '2',
    name: 'Code Reviewer',
    description: 'Thorough code analysis with best practices, security checks, and optimization tips.',
    icon: 'Code',
    mode: 'strict',
    color: 'mint',
  },
  {
    id: '3',
    name: 'Legal Advisor',
    description: 'Contract review and legal guidance for business agreements and compliance.',
    icon: 'Scale',
    mode: 'strict',
    color: 'peach',
  },
  {
    id: '4',
    name: 'Study Buddy',
    description: 'Personalized learning companion for exam prep and concept mastery.',
    icon: 'GraduationCap',
    mode: 'flexible',
    color: 'sky',
  },
  {
    id: '5',
    name: 'Content Writer',
    description: 'Creative copywriting for blogs, social media, and marketing materials.',
    icon: 'PenTool',
    mode: 'flexible',
    color: 'rose',
  },
  {
    id: '6',
    name: 'Productivity Coach',
    description: 'Time management strategies and workflow optimization for peak performance.',
    icon: 'Target',
    mode: 'strict',
    color: 'amber',
  },
];
