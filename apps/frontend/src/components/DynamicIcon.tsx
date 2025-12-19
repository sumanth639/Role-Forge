import { Rocket, Code, Scale, GraduationCap, PenTool, Target, Brain, Lightbulb, Heart, Shield, Zap, Star, MessageSquare, Users, Briefcase, Camera, Music, Palette, Globe, Coffee } from 'lucide-react';
import type { IconName } from '@/content/icons';

const iconMap = {
  Rocket,
  Code,
  Scale,
  GraduationCap,
  PenTool,
  Target,
  Brain,
  Lightbulb,
  Heart,
  Shield,
  Zap,
  Star,
  MessageSquare,
  Users,
  Briefcase,
  Camera,
  Music,
  Palette,
  Globe,
  Coffee,
};

interface DynamicIconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function DynamicIcon({ name, className, size = 24 }: DynamicIconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    return <div className={className} style={{ width: size, height: size }} />;
  }
  
  return <IconComponent className={className} size={size} />;
}
