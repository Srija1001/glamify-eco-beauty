import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Leaf, Coins, Trash2, Plus, Minus, Recycle, Sparkles, ArrowLeft, ShoppingBag } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, totalPrice, totalCoins, clearCart } = useCart();

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Checkout functionality coming soon!",
    });
  };

  const plasticSaved = items.length * 15; // grams per tube

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold mb-8">Your Sustainable Cart</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Your cart is empty</p>
                    <Link to="/shop">
                      <Button>Continue Shopping</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Link to={`/product/${item.id}`}>
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          </Link>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <Link to={`/product/${item.id}`}>
                                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                  {item.name}
                                </h3>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.id)}
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
                              <Badge variant="secondary" className="gap-1">
                                <Coins className="w-3 h-3" />
                                +{item.coins} coins
                              </Badge>
                              {item.is_trial && (
                                <Badge variant="outline">Trial</Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                    className="w-full"
                  >
                    Clear Cart
                  </Button>
                </>
              )}
            </div>

            {/* Summary & Impact */}
            {items.length > 0 && (
              <div className="space-y-4">
                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span className="font-semibold flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {totalPrice}
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
                        {totalPrice}
                      </span>
                    </div>
                    <Button onClick={handleCheckout} className="w-full" size="lg">
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
                      <span className="font-bold text-primary">{totalCoins}</span>
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
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
