import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Leaf, Coins, Trash2, Plus, Minus, Recycle, Sparkles } from "lucide-react";
import { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  coinsEarnable: number;
  recyclable: boolean;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Vitamin C Serum",
      price: 899,
      quantity: 1,
      image: "/placeholder.svg",
      coinsEarnable: 50,
      recyclable: true,
    },
    {
      id: 2,
      name: "Hydrating Face Cream",
      price: 1299,
      quantity: 2,
      image: "/placeholder.svg",
      coinsEarnable: 75,
      recyclable: true,
    },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCoinsEarnable = cartItems.reduce(
    (sum, item) => sum + (item.recyclable ? item.coinsEarnable * item.quantity : 0),
    0
  );
  const plasticSaved = cartItems.filter(item => item.recyclable).length * 15; // grams per tube

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Your Sustainable Cart</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </CardContent>
                </Card>
              ) : (
                cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl font-bold flex items-center">
                              <IndianRupee className="w-4 h-4" />
                              {item.price}
                            </span>
                            {item.recyclable && (
                              <Badge variant="secondary" className="gap-1">
                                <Coins className="w-3 h-3" />
                                +{item.coinsEarnable} coins
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-8 w-8"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-8 w-8"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Summary & Impact */}
            <div className="space-y-4">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-semibold text-primary">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {subtotal}
                    </span>
                  </div>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>

              {/* Sustainability Impact */}
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-primary" />
                    Your Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-primary" />
                      <span className="text-sm">Coins You'll Earn</span>
                    </div>
                    <span className="font-bold text-primary">{totalCoinsEarnable}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Recycle className="w-5 h-5 text-primary" />
                      <span className="text-sm">Potential Plastic Saved</span>
                    </div>
                    <span className="font-bold text-primary">{plasticSaved}g</span>
                  </div>
                  
                  <Separator className="bg-primary/20" />
                  
                  <div className="text-sm text-muted-foreground bg-background/50 rounded-lg p-3">
                    <Sparkles className="w-4 h-4 inline mr-1 text-primary" />
                    Return your empty tubes to earn these coins and help save the planet!
                  </div>
                </CardContent>
              </Card>

              {/* Eco Benefits */}
              <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-sm">Why Shop With Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Leaf className="w-4 h-4 text-accent mt-0.5" />
                    <span>100% recyclable packaging</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Coins className="w-4 h-4 text-accent mt-0.5" />
                    <span>Earn rewards for returning empties</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Recycle className="w-4 h-4 text-accent mt-0.5" />
                    <span>Support circular beauty economy</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
