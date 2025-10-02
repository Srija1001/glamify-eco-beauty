import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Coins } from "lucide-react";

const generalProducts = [
  {
    id: 1,
    name: "Hydrating Face Serum",
    description: "A lightweight, fast-absorbing serum enriched with hyaluronic acid and vitamin B5. Perfect for all skin types, especially dry and dehydrated skin. Provides 24-hour hydration, plumps fine lines, and creates a smooth base for makeup.",
    benefits: ["24-hour hydration", "Reduces fine lines", "Suitable for all skin types", "Vegan & cruelty-free"],
    price: 45,
    coins: 900,
    image: "/placeholder.svg",
    size: "30ml",
    ingredients: "Hyaluronic Acid, Vitamin B5, Glycerin, Aloe Vera",
    suitableFor: "All skin types, especially dry and dehydrated skin"
  },
  {
    id: 2,
    name: "Vitamin C Brightening Cream",
    description: "An intensive brightening cream with 15% pure vitamin C, niacinamide, and natural extracts. Targets dark spots, evens skin tone, and boosts radiance. The antioxidant-rich formula protects against environmental damage while promoting collagen production.",
    benefits: ["Brightens complexion", "Reduces dark spots", "Anti-aging properties", "Protects from free radicals"],
    price: 52,
    coins: 1040,
    image: "/placeholder.svg",
    size: "50ml",
    ingredients: "Vitamin C (15%), Niacinamide, Vitamin E, Ferulic Acid",
    suitableFor: "Dull, uneven skin tone, hyperpigmentation, mature skin"
  },
  {
    id: 3,
    name: "Gentle Exfoliating Cleanser",
    description: "A creamy, pH-balanced cleanser with gentle AHA/BHA blend that removes makeup, dirt, and dead skin cells without stripping natural oils. Leaves skin soft, clean, and refreshed. Perfect for daily use, morning and evening.",
    benefits: ["Deep cleansing", "Gentle exfoliation", "Maintains skin barrier", "Non-drying formula"],
    price: 28,
    coins: 560,
    image: "/placeholder.svg",
    size: "150ml",
    ingredients: "Glycolic Acid (AHA), Salicylic Acid (BHA), Chamomile Extract, Jojoba Oil",
    suitableFor: "All skin types, acne-prone, combination skin"
  },
  {
    id: 4,
    name: "Overnight Recovery Mask",
    description: "A luxurious overnight mask infused with retinol, peptides, and botanical oils. Works while you sleep to repair, regenerate, and rejuvenate skin. Wake up to smoother, firmer, and more radiant skin. Clinically proven to reduce wrinkles by 30% in 4 weeks.",
    benefits: ["Reduces wrinkles", "Firms skin", "Deep overnight repair", "Improves texture"],
    price: 68,
    coins: 1360,
    image: "/placeholder.svg",
    size: "75ml",
    ingredients: "Retinol, Peptide Complex, Squalane, Rosehip Oil, Ceramides",
    suitableFor: "Mature skin, fine lines, uneven texture"
  }
];

const trialProducts = [
  {
    id: 5,
    name: "Trial Set - Hydration Essentials",
    description: "Experience our bestselling hydration routine with this complete trial set. Includes mini sizes of our hydrating cleanser, serum, and moisturizer. Perfect for 7 days of use or travel. A great way to test our products before committing to full sizes.",
    benefits: ["Complete routine", "7-day supply", "Travel-friendly", "Perfect for testing"],
    price: 15,
    coins: 300,
    image: "/placeholder.svg",
    size: "3 x 10ml",
    ingredients: "See individual products",
    suitableFor: "All skin types, first-time users"
  },
  {
    id: 6,
    name: "Trial Set - Anti-Aging Collection",
    description: "Discover the power of our anti-aging line with this curated trial set. Contains sample sizes of vitamin C serum, retinol cream, and eye cream. Each product works synergistically to combat signs of aging and boost radiance.",
    benefits: ["Complete anti-aging routine", "10-day supply", "Synergistic formulas", "Visible results"],
    price: 20,
    coins: 400,
    image: "/placeholder.svg",
    size: "3 x 15ml",
    ingredients: "See individual products",
    suitableFor: "Mature skin, anti-aging focus, 30+"
  },
  {
    id: 7,
    name: "Trial Set - Acne Solution Kit",
    description: "Target breakouts with our specially formulated acne solution kit. Includes a gentle cleanser with salicylic acid, spot treatment, and oil-free moisturizer. Formulated to clear skin without over-drying or irritation.",
    benefits: ["Clears breakouts", "Prevents new acne", "Balances oil", "Non-irritating"],
    price: 18,
    coins: 360,
    image: "/placeholder.svg",
    size: "3 x 12ml",
    ingredients: "See individual products",
    suitableFor: "Acne-prone, oily, combination skin, teens and adults"
  },
  {
    id: 8,
    name: "Trial Set - Sensitive Skin Care",
    description: "Gentle yet effective care for sensitive skin. This trial set features our fragrance-free, hypoallergenic cleanser, calming toner, and barrier repair cream. Dermatologist-tested and formulated to soothe irritation and strengthen skin's natural barrier.",
    benefits: ["Soothes irritation", "Strengthens barrier", "Fragrance-free", "Dermatologist-tested"],
    price: 16,
    coins: 320,
    image: "/placeholder.svg",
    size: "3 x 10ml",
    ingredients: "See individual products",
    suitableFor: "Sensitive, reactive, rosacea-prone skin"
  }
];

const Shop = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Shop Our Collection
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Discover sustainable beauty products with detailed information to help you make the best choice for your skin.
            </p>
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Coins className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Use your earned coins or pay with money
              </span>
            </div>
          </div>

          {/* Tabs for product categories */}
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="general">General Products</TabsTrigger>
              <TabsTrigger value="trial">Trial Products</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-8">
                {generalProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="trial" className="animate-fade-in">
              <div className="mb-6 bg-accent/30 rounded-2xl p-6 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Perfect for First-Time Users
                </h3>
                <p className="text-muted-foreground">
                  Try our products risk-free with these trial sets. Redeem with coins earned from tube returns or purchase with money.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {trialProducts.map((product) => (
                  <ProductCard key={product.id} product={product} isTrial />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
