import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Coins, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const generalProducts = [
  {
    id: 1,
    name: "Hydrating Face Serum - Premium",
    description: "A lightweight, fast-absorbing serum enriched with hyaluronic acid and vitamin B5. Perfect for all skin types, especially dry and dehydrated skin. Provides 24-hour hydration, plumps fine lines, and creates a smooth base for makeup.",
    benefits: ["24-hour hydration", "Reduces fine lines", "Suitable for all skin types", "Vegan & cruelty-free"],
    price: 1499,
    coins: 900,
    image: "/placeholder.svg",
    size: "100ml",
    quantity: "1 Bottle (100ml)",
    ingredients: "Hyaluronic Acid, Vitamin B5, Glycerin, Aloe Vera",
    suitableFor: "All skin types, especially dry and dehydrated skin",
    rating: 4.7,
    reviews: [
      {
        user: "Priya Sharma",
        rating: 5,
        comment: "Amazing product! My skin feels so hydrated and plump. Worth every rupee.",
        date: "15 Jan 2025"
      },
      {
        user: "Anjali Patel",
        rating: 4,
        comment: "Great serum, absorbs quickly. Noticed visible difference in my skin texture.",
        date: "10 Jan 2025"
      },
      {
        user: "Riya Gupta",
        rating: 5,
        comment: "Best serum I've used! My fine lines are visibly reduced.",
        date: "5 Jan 2025"
      }
    ]
  },
  {
    id: 2,
    name: "Vitamin C Brightening Cream - Professional",
    description: "An intensive brightening cream with 15% pure vitamin C, niacinamide, and natural extracts. Targets dark spots, evens skin tone, and boosts radiance. The antioxidant-rich formula protects against environmental damage while promoting collagen production.",
    benefits: ["Brightens complexion", "Reduces dark spots", "Anti-aging properties", "Protects from free radicals"],
    price: 1799,
    coins: 1040,
    image: "/placeholder.svg",
    size: "100ml",
    quantity: "1 Jar (100ml)",
    ingredients: "Vitamin C (15%), Niacinamide, Vitamin E, Ferulic Acid",
    suitableFor: "Dull, uneven skin tone, hyperpigmentation, mature skin",
    rating: 4.8,
    reviews: [
      {
        user: "Meera Reddy",
        rating: 5,
        comment: "My dark spots have faded significantly! Highly recommend this cream.",
        date: "18 Jan 2025"
      },
      {
        user: "Kavita Singh",
        rating: 5,
        comment: "Excellent product for brightening. My skin glows now!",
        date: "12 Jan 2025"
      },
      {
        user: "Neha Kapoor",
        rating: 4,
        comment: "Good results after 3 weeks of use. Skin tone is more even.",
        date: "8 Jan 2025"
      }
    ]
  },
  {
    id: 3,
    name: "Gentle Exfoliating Cleanser - Family Size",
    description: "A creamy, pH-balanced cleanser with gentle AHA/BHA blend that removes makeup, dirt, and dead skin cells without stripping natural oils. Leaves skin soft, clean, and refreshed. Perfect for daily use, morning and evening.",
    benefits: ["Deep cleansing", "Gentle exfoliation", "Maintains skin barrier", "Non-drying formula"],
    price: 999,
    coins: 560,
    image: "/placeholder.svg",
    size: "250ml",
    quantity: "1 Tube (250ml)",
    ingredients: "Glycolic Acid (AHA), Salicylic Acid (BHA), Chamomile Extract, Jojoba Oil",
    suitableFor: "All skin types, acne-prone, combination skin",
    rating: 4.6,
    reviews: [
      {
        user: "Simran Joshi",
        rating: 5,
        comment: "Perfect cleanser! Removes all makeup and doesn't dry out my skin.",
        date: "20 Jan 2025"
      },
      {
        user: "Divya Menon",
        rating: 4,
        comment: "Great value for money. Lasts long and works effectively.",
        date: "14 Jan 2025"
      },
      {
        user: "Aarti Desai",
        rating: 5,
        comment: "My go-to cleanser now. Skin feels fresh and clean every time.",
        date: "7 Jan 2025"
      }
    ]
  },
  {
    id: 4,
    name: "Overnight Recovery Mask - Luxury Edition",
    description: "A luxurious overnight mask infused with retinol, peptides, and botanical oils. Works while you sleep to repair, regenerate, and rejuvenate skin. Wake up to smoother, firmer, and more radiant skin. Clinically proven to reduce wrinkles by 30% in 4 weeks.",
    benefits: ["Reduces wrinkles", "Firms skin", "Deep overnight repair", "Improves texture"],
    price: 2299,
    coins: 1360,
    image: "/placeholder.svg",
    size: "150ml",
    quantity: "1 Jar (150ml)",
    ingredients: "Retinol, Peptide Complex, Squalane, Rosehip Oil, Ceramides",
    suitableFor: "Mature skin, fine lines, uneven texture",
    rating: 4.9,
    reviews: [
      {
        user: "Pooja Iyer",
        rating: 5,
        comment: "Incredible results! My wrinkles are less visible and skin is so smooth.",
        date: "22 Jan 2025"
      },
      {
        user: "Radhika Nair",
        rating: 5,
        comment: "Best anti-aging product I've tried. My skin looks younger!",
        date: "16 Jan 2025"
      },
      {
        user: "Shruti Agarwal",
        rating: 4,
        comment: "Luxurious texture and amazing results. A bit pricey but worth it.",
        date: "9 Jan 2025"
      }
    ]
  }
];

const trialProducts = [
  {
    id: 5,
    name: "Trial Set - Hydration Essentials",
    description: "Experience our bestselling hydration routine with this complete trial set. Includes mini sizes of our hydrating cleanser, serum, and moisturizer. Perfect for 7 days of use or travel. A great way to test our products before committing to full sizes.",
    benefits: ["Complete routine", "7-day supply", "Travel-friendly", "Perfect for testing"],
    price: 299,
    coins: 300,
    image: "/placeholder.svg",
    size: "3 x 10ml each",
    quantity: "3 Mini Bottles (30ml total)",
    ingredients: "See individual products",
    suitableFor: "All skin types, first-time users",
    rating: 4.5,
    reviews: [
      {
        user: "Sneha Roy",
        rating: 5,
        comment: "Perfect starter kit! Loved all three products, now ordering full sizes.",
        date: "19 Jan 2025"
      },
      {
        user: "Tanvi Verma",
        rating: 4,
        comment: "Great for travel. Helped me decide which products suit my skin.",
        date: "11 Jan 2025"
      }
    ]
  },
  {
    id: 6,
    name: "Trial Set - Anti-Aging Collection",
    description: "Discover the power of our anti-aging line with this curated trial set. Contains sample sizes of vitamin C serum, retinol cream, and eye cream. Each product works synergistically to combat signs of aging and boost radiance.",
    benefits: ["Complete anti-aging routine", "10-day supply", "Synergistic formulas", "Visible results"],
    price: 399,
    coins: 400,
    image: "/placeholder.svg",
    size: "3 x 15ml each",
    quantity: "3 Mini Containers (45ml total)",
    ingredients: "See individual products",
    suitableFor: "Mature skin, anti-aging focus, 30+",
    rating: 4.7,
    reviews: [
      {
        user: "Lakshmi Krishnan",
        rating: 5,
        comment: "Saw visible results in just 10 days! My skin looks brighter and firmer.",
        date: "17 Jan 2025"
      },
      {
        user: "Madhuri Bhatt",
        rating: 4,
        comment: "Excellent trial kit. The retinol cream is amazing!",
        date: "13 Jan 2025"
      }
    ]
  },
  {
    id: 7,
    name: "Trial Set - Acne Solution Kit",
    description: "Target breakouts with our specially formulated acne solution kit. Includes a gentle cleanser with salicylic acid, spot treatment, and oil-free moisturizer. Formulated to clear skin without over-drying or irritation.",
    benefits: ["Clears breakouts", "Prevents new acne", "Balances oil", "Non-irritating"],
    price: 349,
    coins: 360,
    image: "/placeholder.svg",
    size: "3 x 12ml each",
    quantity: "3 Mini Products (36ml total)",
    ingredients: "See individual products",
    suitableFor: "Acne-prone, oily, combination skin, teens and adults",
    rating: 4.6,
    reviews: [
      {
        user: "Ishita Malhotra",
        rating: 5,
        comment: "My acne cleared up within a week! This kit is a lifesaver.",
        date: "21 Jan 2025"
      },
      {
        user: "Ritu Saxena",
        rating: 4,
        comment: "Good for controlling breakouts. Spot treatment works great!",
        date: "15 Jan 2025"
      }
    ]
  },
  {
    id: 8,
    name: "Trial Set - Sensitive Skin Care",
    description: "Gentle yet effective care for sensitive skin. This trial set features our fragrance-free, hypoallergenic cleanser, calming toner, and barrier repair cream. Dermatologist-tested and formulated to soothe irritation and strengthen skin's natural barrier.",
    benefits: ["Soothes irritation", "Strengthens barrier", "Fragrance-free", "Dermatologist-tested"],
    price: 319,
    coins: 320,
    image: "/placeholder.svg",
    size: "3 x 10ml each",
    quantity: "3 Mini Bottles (30ml total)",
    ingredients: "See individual products",
    suitableFor: "Sensitive, reactive, rosacea-prone skin",
    rating: 4.8,
    reviews: [
      {
        user: "Aditi Kulkarni",
        rating: 5,
        comment: "Finally found products that don't irritate my sensitive skin!",
        date: "20 Jan 2025"
      },
      {
        user: "Nisha Bose",
        rating: 5,
        comment: "So gentle and effective. My redness has reduced significantly.",
        date: "14 Jan 2025"
      }
    ]
  }
];

const Shop = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
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
