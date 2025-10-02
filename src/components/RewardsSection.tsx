import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, Gift, Sparkles, TrendingUp } from "lucide-react";

const RewardsSection = () => {
  return (
    <section className="py-24 bg-gradient-accent relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Exclusive Benefits</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Earn While You Beautify
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every action you take contributes to sustainability and earns you rewards. Shop smart, recycle, and get rewarded!
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-hover transition-all duration-300 animate-fade-in border-2 border-border/50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 mx-auto mb-4 flex items-center justify-center shadow-soft">
              <Coins className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Earn Coins
            </h3>
            <p className="text-muted-foreground">
              Get 50 coins for every verified tube return
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-hover transition-all duration-300 animate-fade-in border-2 border-border/50" style={{ animationDelay: "0.1s" }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 mx-auto mb-4 flex items-center justify-center shadow-soft">
              <Gift className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Trial Packs
            </h3>
            <p className="text-muted-foreground">
              Redeem coins for exclusive trial packs
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-hover transition-all duration-300 animate-fade-in border-2 border-border/50" style={{ animationDelay: "0.2s" }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/50 mx-auto mb-4 flex items-center justify-center shadow-soft">
              <TrendingUp className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Level Up
            </h3>
            <p className="text-muted-foreground">
              Unlock exclusive perks as you collect more coins
            </p>
          </Card>
        </div>
        
        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-hover border-2 border-border/50 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Start Earning Today
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Sign up now and get 100 welcome coins! Use them to try our bestselling products and start your sustainable beauty journey.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">100 bonus coins on signup</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">50 coins per tube return</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">Exclusive member-only deals</span>
                </li>
              </ul>
              <Button variant="hero" size="lg">
                Join Now & Earn
              </Button>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  1,000+
                </div>
                <p className="text-xl text-foreground font-semibold mb-2">
                  Average Coins Earned
                </p>
                <p className="text-muted-foreground">
                  by active members per month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;
