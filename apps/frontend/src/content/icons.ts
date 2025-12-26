export const availableIcons = [
  'Rocket',
  'Code',
  'Scale',
  'GraduationCap',
  'PenTool',
  'Target',
  'Brain',
  'Lightbulb',
  'Heart',
  'Shield',
  'Zap',
  'Star',
  'MessageSquare',
  'Users',
  'Briefcase',
  'Camera',
  'Music',
  'Palette',
  'Globe',
  'Coffee',
  'Bug',        
  'Layers',     
] as const;


export type IconName = typeof availableIcons[number];
