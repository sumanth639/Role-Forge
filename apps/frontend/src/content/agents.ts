export type AgentMode = 'strict' | 'flexible';

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  mode: AgentMode;
  color: string;
}

export const agents: Agent[] = [
  {
    id: '1',
    name: 'Startup Mentor',
    description:
      'Acts as an experienced startup advisor. Helps founders with idea validation, MVP planning, fundraising strategies, growth decisions, and early-stage problem solving. Focuses on practical, real-world guidance rather than theory.',
    icon: 'Rocket',
    mode: 'flexible',
    color: 'lavender',
  },
  {
    id: '2',
    name: 'Code Reviewer',
    description:
      'Reviews code with a strict engineering mindset. Identifies bugs, performance issues, security risks, and code smells. Suggests clean, scalable, and production-ready improvements following best practices.',
    icon: 'Code',
    mode: 'strict',
    color: 'mint',
  },
  {
    id: '3',
    name: 'Legal Advisor',
    description:
      'Provides structured legal guidance for contracts, policies, compliance, and business agreements. Focuses on risk awareness, clarity, and professional legal language without unnecessary complexity.',
    icon: 'Scale',
    mode: 'strict',
    color: 'peach',
  },
  {
    id: '4',
    name: 'Study Buddy',
    description:
      'Explains concepts step by step in a student-friendly way. Helps with exam preparation, concept clarity, examples, and revision plans. Adapts explanations based on the learner’s level.',
    icon: 'GraduationCap',
    mode: 'flexible',
    color: 'sky',
  },
  {
    id: '5',
    name: 'Content Writer',
    description:
      'Creates engaging and original content for blogs, websites, social media, and marketing campaigns. Focuses on clarity, tone, audience targeting, and brand consistency.',
    icon: 'PenTool',
    mode: 'flexible',
    color: 'rose',
  },
  {
    id: '6',
    name: 'Productivity Coach',
    description:
      'Helps optimize time, focus, and workflows. Suggests routines, prioritization methods, productivity systems, and actionable habits to improve efficiency and consistency.',
    icon: 'Target',
    mode: 'strict',
    color: 'amber',
  },
{
  id: '7',
  name: 'System Designer',
  description:
    'Designs scalable system architectures. Helps with database modeling, API design, trade-offs, and real-world system design decisions.',
  icon: 'Brain',          
  mode: 'strict',
  color: 'sage',          
},
{
  id: '8',
  name: 'Interview Coach',
  description:
    'Prepares users for technical and HR interviews through mock questions, structured feedback, and improvement strategies.',
  icon: 'Briefcase',     
  mode: 'strict',
  color: 'sky',          
},
{
  id: '9',
  name: 'Debugging Assistant',
  description:
    'Helps identify, analyze, and fix bugs by explaining root causes and providing step-by-step debugging guidance.',
  icon: 'Shield',         
  mode: 'flexible',
  color: 'mint',          
},

];
