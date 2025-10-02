import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, Gift, Recycle } from "lucide-react";

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Upload Your Empty Tubes",
    description: "Take clear photos of your empty beauty product tubes through our mobile app or website. Make sure the product label is visible and the tube is clean and empty."
  },
  {
    icon: CheckCircle2,
    number: "02",
    title: "Verification & Collection",
    description: "Our delivery partners will verify if your tubes are recyclable by checking the material type and condition. Once approved, they'll collect the tubes from your doorstep at no extra cost."
  },
  {
    icon: Recycle,
    number: "03",
    title: "Sustainable Recycling",
    description: "Your empty tubes are sent to our certified recycling partners where they're cleaned, processed, and transformed into new materials, reducing environmental waste."
  },
  {
    icon: Gift,
    number: "04",
    title: "Earn Coins Instantly",
    description: "Receive 50 coins for each verified tube in your Glamify account. Use these coins to get trial packs, purchase products, or unlock exclusive member benefits!"
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
            Tube Return Process
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Turn your empty tubes into rewards! Here's how our simple tube return process works and how you can start earning coins today.
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
          <div className="bg-card rounded-2xl p-8 max-w-2xl mx-auto mb-8 shadow-soft border-2 border-border/50">
            <h3 className="text-2xl font-bold text-foreground mb-4">Earn More Coins</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">50</p>
                <p className="text-sm text-muted-foreground">Coins per verified tube</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">100</p>
                <p className="text-sm text-muted-foreground">Welcome bonus coins</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">20</p>
                <p className="text-sm text-muted-foreground">Coins = $1 value</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              The more tubes you return, the more coins you earn! Use your coins to try new products, get exclusive trial packs, or unlock member-only discounts.
            </p>
          </div>
          <Button variant="hero" size="lg">
            Start Returning Tubes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
