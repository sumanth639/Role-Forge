import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { AgentsSection } from '@/components/AgentsSection';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Blob Glow Effects - Full Width */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {/* Blob 1 - Top Left */}
        <div 
          className="absolute rounded-full blur-[80px] animate-blob" 
          style={{ 
            top: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            background: 'hsl(168 55% 42%)',
            opacity: 0.3,
            zIndex: 0
          }} 
        />
        {/* Blob 2 - Top Right */}
        <div 
          className="absolute rounded-full blur-[80px] animate-blob" 
          style={{ 
            top: '-150px',
            right: '-150px',
            width: '600px',
            height: '600px',
            background: 'hsl(258 40% 55%)',
            opacity: 0.2,
            animationDelay: '2s',
            zIndex: 0
          }} 
        />
        {/* Blob 3 - Bottom Left */}
        <div 
          className="absolute rounded-full blur-[80px] animate-blob" 
          style={{ 
            bottom: '-100px',
            left: '10%',
            width: '450px',
            height: '450px',
            background: 'hsl(165 35% 50%)',
            opacity: 0.2,
            animationDelay: '4s',
            zIndex: 0
          }} 
        />
        {/* Blob 4 - Bottom Right */}
        <div 
          className="absolute rounded-full blur-[80px] animate-blob" 
          style={{ 
            bottom: '-120px',
            right: '10%',
            width: '550px',
            height: '550px',
            background: 'hsl(168 55% 42%)',
            opacity: 0.2,
            animationDelay: '1s',
            zIndex: 0
          }} 
        />
        {/* Blob 5 - Center */}
        <div 
          className="absolute rounded-full blur-[100px] animate-blob" 
          style={{ 
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '700px',
            background: 'hsl(205 55% 55%)',
            opacity: 0.2,
            animationDelay: '3s',
            zIndex: 0
          }} 
        />
      </div>

      <Navigation />
      
      <main className="relative mx-auto max-w-6xl px-6 py-8" style={{ zIndex: 1 }}>
        <Hero />
        <AgentsSection />
      </main>
    </div>
  );
};

export default Index;