import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, ShoppingCart, Coins, Leaf, Check, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ["product-reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product) return;
    const success = addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      coins: product.coins,
      image: product.image,
      size: product.size,
      is_trial: product.is_trial,
    });
    if (!success) {
      toast({
        title: "Sign in Required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <Button onClick={() => navigate("/shop")} className="mt-4">
            Back to Shop
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-accent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.is_trial && (
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                Trial Size
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-muted-foreground">
                      ({reviews?.length || 0} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-lg text-muted-foreground">{product.description}</p>

            {/* Price & Coins */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-3xl font-bold text-foreground">
                    ${product.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Earn</p>
                  <div className="flex items-center gap-1 text-primary">
                    <Coins className="w-5 h-5" />
                    <span className="text-2xl font-bold">{product.coins}</span>
                    <span className="text-sm">coins</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleAddToCart} className="w-full" size="lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </Card>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Size</p>
                <p className="font-semibold text-foreground">{product.size}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-semibold text-foreground">{product.quantity}</p>
              </div>
            </div>

            {/* Suitable For */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Suitable For</h3>
              <p className="text-muted-foreground">{product.suitable_for}</p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Benefits</h3>
              <div className="space-y-2">
                {product.benefits?.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Ingredients</h3>
              <p className="text-sm text-muted-foreground">{product.ingredients}</p>
            </div>

            {/* Sustainability Badge */}
            <div className="flex items-center gap-2 p-4 bg-primary/10 rounded-lg">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground">
                Return empty tube for <strong>{product.coins} bonus coins</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Customer Reviews
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-foreground">
                      {review.user_name}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(review.review_date).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
