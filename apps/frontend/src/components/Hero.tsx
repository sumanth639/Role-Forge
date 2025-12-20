import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <header className="relative mb-16 pt-8">
      {/* Hero Content Section */}
      <div className="text-center mb-12">
      <h1 className="opacity-0 animate-fade-up text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 text-balance leading-tight tracking-tight max-w-5xl mx-auto" style={{ animationDelay: '100ms' }}>
  Forge Your Own Intelligent{' '}
  <span className="text-primary">AI Agents</span> for Any Reality
</h1>
        <p className="opacity-0 animate-fade-up text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8" style={{ animationDelay: '200ms' }}>
          Create and customize intelligent AI assistants tailored to your needs. Build agents for coding, writing, learning, mentoring, and any role you can imagine.
        </p>

        {/* CTA Buttons */}
        <div className="opacity-0 animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-6" style={{ animationDelay: '250ms' }}>
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-background/50 backdrop-blur-sm border-2 border-primary hover:bg-secondary/50 text-foreground px-8"
          >
            Get Started
          </Button>
        </div>

        {/* Demo Link */}
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <Link
            to="/create" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            Create your first agent 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Video/Dashboard Preview Section */}
    {/*   <div
        className="opacity-0 animate-fade-up mt-12 flex justify-center"
        style={{ animationDelay: '350ms' }}
        id="demo"
      >
        <div className="relative w-full max-w-6xl">
         
          <div className="relative rounded-3xl overflow-hidden border border-border/30 bg-card/40 backdrop-blur-2xl shadow-float">
           
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none z-10" />
            
           
            <div className="relative z-20 flex items-center gap-2 px-4 py-3 bg-card/30 backdrop-blur-sm border-b border-border/20">
             
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              
             
              <div className="flex items-center gap-1 ml-4">
                <div className="w-6 h-6 rounded bg-background/20 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-foreground">
                    <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="w-6 h-6 rounded bg-background/20 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-foreground">
                    <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

             
              <div className="flex-1 mx-4 px-4 py-1.5 rounded-lg bg-background/20 border border-border/20 text-xs text-muted-foreground">
                roleforge.ai / dashboard
              </div>

              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Overview</span>
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs">+</span>
                </div>
              </div>
            </div>

           
            <div className="relative aspect-video bg-background/20">
              <video
                src="/hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
             
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

         
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl opacity-30 -z-10" />
        </div>
      </div> */}
    </header>
  );
}

