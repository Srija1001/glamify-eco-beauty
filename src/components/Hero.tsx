import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-beauty.jpg";
import { Leaf, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Leaf className="w-12 h-12 text-secondary opacity-30" />
      </div>
      <div className="absolute bottom-32 right-20 animate-float" style={{ animationDelay: "1s" }}>
        <Sparkles className="w-16 h-16 text-accent opacity-30" />
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft">
              <Leaf className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-foreground">100% Sustainable Beauty</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Beauty That
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Gives Back</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Shop sustainable beauty products, return your empty tubes, earn rewards, and get personalized AI-powered recommendations. Together, we're making beauty circular.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button variant="hero" size="lg">
                  Start Shopping
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="feature" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
            
            <div className="flex gap-8 pt-8">
              <div>
                <p className="text-3xl font-bold text-primary">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">100K+</p>
                <p className="text-sm text-muted-foreground">Tubes Recycled</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">500+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
            </div>
          </div>
          
          {/* Right image */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative rounded-3xl overflow-hidden shadow-hover">
              <img 
                src={heroImage} 
                alt="Sustainable beauty products" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative blob */}
            <div className="absolute -z-10 top-1/4 -right-8 w-72 h-72 bg-gradient-accent rounded-full blur-3xl opacity-30" />
            <div className="absolute -z-10 -bottom-8 -left-8 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-30" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
