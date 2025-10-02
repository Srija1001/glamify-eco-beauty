import { Card } from "@/components/ui/card";
import recycleIcon from "@/assets/recycle-icon.png";
import aiAssistantIcon from "@/assets/ai-assistant-icon.png";
import chatbotIcon from "@/assets/chatbot-icon.png";
import rewardsIcon from "@/assets/rewards-icon.png";

const features = [
  {
    icon: recycleIcon,
    title: "Tube Return Process",
    description: "Upload photos of your empty beauty tubes. Our delivery partners verify and collect recyclable products, helping create a circular beauty economy.",
    color: "from-secondary to-secondary/50"
  },
  {
    icon: aiAssistantIcon,
    title: "AI Product Analysis",
    description: "Get detailed insights about every product. Our AI analyzes ingredients, benefits, and suitability for your skin type, making informed choices easy.",
    color: "from-accent to-accent/50"
  },
  {
    icon: chatbotIcon,
    title: "Personal Beauty Advisor",
    description: "Chat with our AI assistant 24/7 for personalized skincare guidance, product recommendations, and expert beauty tips tailored to your needs.",
    color: "from-primary to-primary/50"
  },
  {
    icon: rewardsIcon,
    title: "Rewards & Coins",
    description: "Earn coins for every verified tube return. Redeem them for trial packs and discover new products while contributing to sustainability.",
    color: "from-[#FFD700] to-[#FFA500]/50"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-feature">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose Glamify?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of sustainable beauty shopping with features designed to make your journey effortless and rewarding.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-hover transition-all duration-300 hover:scale-105 animate-fade-in border-2 border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} p-4 mb-6 shadow-soft`}>
                <img 
                  src={feature.icon} 
                  alt={feature.title}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
