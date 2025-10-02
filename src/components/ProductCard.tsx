import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, DollarSign, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: number;
  name: string;
  description: string;
  benefits: string[];
  price: number;
  coins: number;
  image: string;
  size: string;
  ingredients: string;
  suitableFor: string;
}

interface ProductCardProps {
  product: Product;
  isTrial?: boolean;
}

const ProductCard = ({ product, isTrial = false }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 border-2 border-border/50 flex flex-col">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        {isTrial && (
          <Badge className="absolute top-4 right-4 bg-secondary">
            Trial Pack
          </Badge>
        )}
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{product.name}</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Info className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{product.name}</DialogTitle>
                <DialogDescription className="text-base pt-2">
                  {product.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 pt-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Key Benefits</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Size</h4>
                  <p className="text-muted-foreground">{product.size}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Key Ingredients</h4>
                  <p className="text-muted-foreground">{product.ingredients}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Suitable For</h4>
                  <p className="text-muted-foreground">{product.suitableFor}</p>
                </div>

                <div className="bg-accent/20 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">How to Use</h4>
                  <p className="text-sm text-muted-foreground">
                    {isTrial 
                      ? "Follow the instructions included with each product in the trial set. Use consistently for best results."
                      : "Apply to clean, dry skin. Use as directed on the packaging. For best results, use consistently as part of your daily skincare routine."}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Size:</span>
            <span>{product.size}</span>
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Suitable for:</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.suitableFor}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-3 pt-6 border-t border-border/50">
        {/* Pricing */}
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Money</span>
            </div>
            <p className="text-xl font-bold text-foreground">${product.price}</p>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-secondary/5 border border-secondary/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Coins className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Coins</span>
            </div>
            <p className="text-xl font-bold text-foreground">{product.coins}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full">
            <DollarSign className="w-4 h-4 mr-1" />
            Buy Now
          </Button>
          <Button variant="default" className="w-full">
            <Coins className="w-4 h-4 mr-1" />
            Use Coins
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
