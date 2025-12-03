import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, IndianRupee, Info, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  price: number;
  coins: number;
  image: string | null;
  size: string;
  ingredients: string;
  suitable_for: string;
  quantity: string;
  rating: number;
  is_trial?: boolean;
  reviews: {
    user_name: string;
    rating: number;
    comment: string;
    review_date: string;
  }[];
}

interface ProductCardProps {
  product: Product;
  isTrial?: boolean;
}

const ProductCard = ({ product, isTrial = false }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      coins: product.coins,
      image: product.image,
      size: product.size,
      is_trial: product.is_trial || isTrial,
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 border-2 border-border/50 flex flex-col h-full cursor-pointer">
        {/* Product Image */}
        <div className="relative h-64 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
          {isTrial && (
            <Badge className="absolute top-4 right-4 bg-secondary z-10">
              Trial Pack
            </Badge>
          )}
          <img 
            src={product.image || '/placeholder.svg'} 
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {/* Rating Badge */}
          <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 border border-border/50">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold text-sm">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews?.length || 0})</span>
          </div>
        </div>

        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl">{product.name}</CardTitle>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Info className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="line-clamp-2">{product.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Size:</span>
                <span>{product.size}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Qty:</span>
                <span>{product.quantity}</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Suitable for:</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.suitable_for}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3 pt-6 border-t border-border/50">
          {/* Pricing */}
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-center gap-1 mb-1">
                <IndianRupee className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Price</span>
              </div>
              <p className="text-xl font-bold text-foreground">₹{product.price}</p>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-secondary/5 border border-secondary/20">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Coins className="w-4 h-4 text-secondary" />
                <span className="text-sm text-muted-foreground">Earn</span>
              </div>
              <p className="text-xl font-bold text-foreground">{product.coins}</p>
            </div>
          </div>

          {/* Action Button */}
          <Button onClick={handleAddToCart} className="w-full" size="lg">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
