import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { AgentsSection } from '@/components/AgentsSection';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {/* Blob 1 - Top Left (Soft Mint) */}
        <div 
          className="absolute rounded-full blur-[120px] animate-blob" 
          style={{ 
            top: '-5%',
            left: '-5%',
            width: '40vw',
            height: '40vw',
            background: 'radial-gradient(circle, hsl(168 55% 42%) 0%, transparent 70%)',
            opacity: 0.12, // Reduced opacity significantly
            zIndex: 0
          }} 
        />
        {/* Blob 2 - Top Right (Soft Indigo) */}
        <div 
          className="absolute rounded-full blur-[140px] animate-blob" 
          style={{ 
            top: '5%',
            right: '-10%',
            width: '45vw',
            height: '45vw',
            background: 'radial-gradient(circle, hsl(258 40% 55%) 0%, transparent 70%)',
            opacity: 0.08,
            animationDelay: '4s',
            zIndex: 0
          }} 
        />
        {/* Blob 3 - Center (Ocean Blue) */}
        <div 
          className="absolute rounded-full blur-[160px] animate-blob" 
          style={{ 
            top: '40%',
            left: '30%',
            width: '50vw',
            height: '50vw',
            background: 'radial-gradient(circle, hsl(205 55% 55%) 0%, transparent 70%)',
            opacity: 0.06,
            animationDelay: '7s',
            zIndex: 0
          }} 
        />
      </div>

      <Navigation />
      
      <main className="relative mx-auto max-w-7xl px-6 py-8 mt-16" style={{ zIndex: 1 }}>
        <Hero />
        <AgentsSection />
      </main>
    </div>
  );
};

export default Index;