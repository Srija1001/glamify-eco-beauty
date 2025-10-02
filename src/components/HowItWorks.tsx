import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, Gift, Recycle } from "lucide-react";

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Upload Empty Tubes",
    description: "Take a photo of your used beauty product tubes through our easy-to-use app interface."
  },
  {
    icon: CheckCircle2,
    number: "02",
    title: "Verification",
    description: "Our delivery partners verify if the tubes are recyclable and collect them from your doorstep."
  },
  {
    icon: Recycle,
    number: "03",
    title: "Recycling Process",
    description: "Your tubes are processed through our sustainable recycling partners, giving them a new life."
  },
  {
    icon: Gift,
    number: "04",
    title: "Earn Rewards",
    description: "Receive coins in your account that you can use to purchase trial packs and new products."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of beauty lovers in our circular economy. It's simple, rewarding, and makes a real difference.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -z-10" />
                )}
                
                <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 border-2 border-border/50 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="text-3xl font-bold text-primary/20">
                      {step.number}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button variant="hero" size="lg">
            Start Your Journey
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
