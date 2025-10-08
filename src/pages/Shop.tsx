import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Coins, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  user_name: string;
  rating: number;
  comment: string;
  review_date: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  price: number;
  coins: number;
  image: string | null;
  size: string;
  quantity: string;
  ingredients: string;
  suitable_for: string;
  rating: number;
  is_trial: boolean;
  reviews: Review[];
}

const Shop = () => {
  const navigate = useNavigate();
  
  // Fetch products from database
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

      if (productsError) throw productsError;

      // Fetch reviews for all products
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('product_reviews')
        .select('*')
        .order('review_date', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Combine products with their reviews
      return productsData.map(product => ({
        ...product,
        reviews: reviewsData
          .filter(review => review.product_id === product.id)
          .map(review => ({
            user_name: review.user_name,
            rating: review.rating,
            comment: review.comment,
            review_date: new Date(review.review_date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          }))
      })) as Product[];
    }
  });

  const generalProducts = products.filter(p => !p.is_trial);
  const trialProducts = products.filter(p => p.is_trial);
  
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
                <TabsTrigger value="general">General Products</TabsTrigger>
                <TabsTrigger value="trial">Trial Products</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="animate-fade-in">
                {generalProducts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No general products available at the moment.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-8">
                    {generalProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
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
                {trialProducts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No trial products available at the moment.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-8">
                    {trialProducts.map((product) => (
                      <ProductCard key={product.id} product={product} isTrial />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
