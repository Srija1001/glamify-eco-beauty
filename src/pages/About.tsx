import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Leaf, Users, Heart, Recycle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              About Glamify
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Revolutionizing beauty with sustainability at our core. We believe beauty shouldn't cost the Earth.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Glamify, we're on a mission to transform the beauty industry by making sustainability accessible 
                and rewarding. We believe that every empty cosmetic tube represents an opportunity to make a difference.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through our innovative tube return program, we've created a circular economy where your beauty routine 
                contributes to a healthier planet while earning you rewards.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-soft transition-shadow">
                <Leaf className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Eco-Friendly</h3>
                <p className="text-sm text-muted-foreground">
                  100% recyclable packaging and sustainable practices
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-soft transition-shadow">
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Join thousands making a positive environmental impact
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-soft transition-shadow">
                <Heart className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Quality First</h3>
                <p className="text-sm text-muted-foreground">
                  Premium beauty products that care for you and Earth
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-soft transition-shadow">
                <Recycle className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Circular Economy</h3>
                <p className="text-sm text-muted-foreground">
                  Return, recycle, and get rewarded for every tube
                </p>
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
                <div className="text-muted-foreground">Tubes Recycled</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">2.5 Tons</div>
                <div className="text-muted-foreground">Plastic Saved</div>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Glamify was born from a simple observation: millions of beauty product tubes end up in landfills 
              every year. We knew there had to be a better way. In 2024, we launched with a vision to create 
              a beauty brand that doesn't just talk about sustainability, but makes it rewarding and easy.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we're proud to be leading the charge in circular beauty, proving that you don't have to 
              compromise on quality to care for the planet. Every product we create, every tube you return, 
              brings us closer to a waste-free future.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
