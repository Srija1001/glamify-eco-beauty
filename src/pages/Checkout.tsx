import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  IndianRupee, Coins, ArrowLeft, CreditCard, Truck, Wallet,
  MapPin, Phone, User, CheckCircle2, ShoppingBag, Loader2, Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, totalCoins, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [coinsToUse, setCoinsToUse] = useState(0);
  const [userCoins, setUserCoins] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Sign in Required", description: "Please sign in to checkout.", variant: "destructive" });
        navigate("/auth");
        return;
      }
      setIsLoggedIn(true);
      const { data: profile } = await supabase
        .from("profiles")
        .select("total_coins, full_name, email")
        .eq("user_id", user.id)
        .single();
      if (profile) {
        setUserCoins(profile.total_coins);
        setAddress((prev) => ({ ...prev, fullName: profile.full_name || "" }));
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [items, navigate, orderPlaced]);

  const coinDiscount = Math.min(coinsToUse, userCoins, totalPrice);
  const finalAmount = totalPrice - coinDiscount;

  const isPhoneValid = /^[6-9]\d{9}$/.test(address.phone);
  const isPincodeValid = /^\d{6}$/.test(address.pincode);

  const isFormValid =
    address.fullName.trim().length >= 2 &&
    isPhoneValid &&
    address.street.trim().length >= 5 &&
    address.city.trim() &&
    address.state.trim() &&
    isPincodeValid;

  const [placedOrderNumber, setPlacedOrderNumber] = useState("");

  const recordOrder = async (paymentId?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: "temp", // will be overwritten by trigger
        status: "confirmed",
        payment_method: paymentMethod === "cod" ? "cod" : `razorpay_${paymentMethod}`,
        subtotal: totalPrice,
        coins_used: coinDiscount,
        total_paid: finalAmount,
        coins_earned: totalCoins,
        shipping_name: address.fullName,
        shipping_phone: address.phone,
        shipping_street: address.street,
        shipping_city: address.city,
        shipping_state: address.state,
        shipping_pincode: address.pincode,
      })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error("Order creation error:", orderError);
      throw new Error("Failed to create order");
    }

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: orderData.id,
      product_name: item.name,
      product_type: item.is_trial ? "trial" : "general",
      quantity: item.quantity,
      price: item.price,
      coins: item.coins,
    }));
    await supabase.from("order_items").insert(orderItems);

    // Also insert into purchases for backward compat
    for (const item of items) {
      await supabase.from("purchases").insert({
        user_id: user.id,
        product_name: item.name,
        product_type: item.is_trial ? "trial" : "general",
        amount_paid: item.price * item.quantity - (coinDiscount * (item.price * item.quantity / totalPrice)),
        coins_used: Math.round(coinDiscount * (item.price * item.quantity / totalPrice)),
        payment_method: paymentMethod === "cod" ? "cod" : `razorpay_${paymentMethod}`,
      });
    }

    if (coinDiscount > 0) {
      await supabase.from("coin_transactions").insert({
        user_id: user.id,
        amount: -coinDiscount,
        type: "spent",
        description: `Used ${coinDiscount} coins on order ${orderData.order_number}`,
      });
      await supabase
        .from("profiles")
        .update({ total_coins: userCoins - coinDiscount })
        .eq("user_id", user.id);
    }

    if (totalCoins > 0) {
      await supabase.from("coin_transactions").insert({
        user_id: user.id,
        amount: totalCoins,
        type: "earned",
        description: `Earned from order ${orderData.order_number}`,
      });
      await supabase
        .from("profiles")
        .update({ total_coins: userCoins - coinDiscount + totalCoins })
        .eq("user_id", user.id);
    }

    setPlacedOrderNumber(orderData.order_number);
    setOrderPlaced(true);
    clearCart();
    toast({ title: "Order Placed! 🎉", description: `Order ${orderData.order_number} confirmed.` });
  };

  const initiateRazorpay = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: { amount: finalAmount, currency: "INR" },
      });

      console.log("Razorpay order response:", { data, error });

      if (error) {
        throw new Error(error.message || "Failed to create order");
      }

      if (!data?.order_id) {
        throw new Error("No order_id returned from server");
      }

      const RazorpayClass = (window as any).Razorpay;
      if (!RazorpayClass) {
        throw new Error("Razorpay SDK not loaded. Please refresh the page.");
      }

      const options = {
        key: "rzp_test_SOklHhkLIXrLTB",
        amount: data.amount,
        currency: data.currency,
        name: "Glamify",
        description: "Beauty Products Order",
        order_id: data.order_id,
        handler: async (response: any) => {
          console.log("Razorpay payment success:", response);
          await recordOrder(response.razorpay_payment_id);
          setLoading(false);
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast({ title: "Payment Cancelled", description: "You cancelled the payment.", variant: "destructive" });
          },
        },
      };

      const rzp = new RazorpayClass(options);
      rzp.on("payment.failed", (response: any) => {
        console.error("Razorpay payment failed:", response.error);
        setLoading(false);
        toast({ title: "Payment Failed", description: response.error?.description || "Payment failed.", variant: "destructive" });
      });
      rzp.open();
    } catch (err: any) {
      console.error("Razorpay initiation error:", err);
      toast({ title: "Payment Error", description: err.message || "Could not initiate payment.", variant: "destructive" });
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isFormValid) {
      toast({ title: "Missing Info", description: "Please fill all address fields.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === "cod") {
        await recordOrder();
      } else {
        // UPI and Card go through Razorpay
        await initiateRazorpay();
        return; // loading state managed by Razorpay handler
      }
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      if (paymentMethod === "cod") setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-lg text-center py-20">
            <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
            {placedOrderNumber && (
              <p className="text-lg font-mono bg-muted px-4 py-2 rounded-lg inline-block mb-3">
                {placedOrderNumber}
              </p>
            )}
            <p className="text-muted-foreground mb-2">
              Thank you for your sustainable purchase. Track your order anytime.
            </p>
            {totalCoins > 0 && (
              <Badge variant="secondary" className="gap-1 text-base px-4 py-2 mb-6">
                <Coins className="w-4 h-4" /> +{totalCoins} coins earned
              </Badge>
            )}
            <div className="flex gap-4 justify-center mt-6">
              <Button onClick={() => navigate("/orders")}>
                <Package className="w-4 h-4 mr-2" /> Track Order
              </Button>
              <Button variant="outline" onClick={() => navigate("/shop")}>
                <ShoppingBag className="w-4 h-4 mr-2" /> Continue Shopping
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate("/cart")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
          </Button>
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Address + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="fullName" placeholder="Your name" className="pl-9"
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="phone" placeholder="10-digit number" className="pl-9"
                        maxLength={10}
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
                    </div>
                    {address.phone && !isPhoneValid && (
                      <p className="text-xs text-destructive mt-1">Enter a valid 10-digit Indian phone number</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input id="street" placeholder="House no, Street, Landmark" className="mt-1"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" className="mt-1"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="State" className="mt-1"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" placeholder="6-digit pincode" className="mt-1"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"}`}>
                      <RadioGroupItem value="cod" id="cod" />
                      <Truck className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border"}`}>
                      <RadioGroupItem value="upi" id="upi" />
                      <Wallet className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">UPI Payment</p>
                        <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </label>

                  </RadioGroup>

                  {paymentMethod === "upi" && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      You'll be redirected to Razorpay's secure payment page to complete your UPI payment.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Use Coins */}
              {isLoggedIn && userCoins > 0 && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-primary" /> Pay with Coins
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      You have <span className="font-bold text-primary">{userCoins}</span> coins available.
                      1 coin = ₹1 discount.
                    </p>
                    <div>
                      <Label htmlFor="coins">Coins to use (max {Math.min(userCoins, totalPrice)})</Label>
                      <Input
                        id="coins"
                        type="number"
                        min={0}
                        max={Math.min(userCoins, totalPrice)}
                        value={coinsToUse}
                        onChange={(e) => setCoinsToUse(Math.min(Number(e.target.value), userCoins, totalPrice))}
                        className="mt-1"
                      />
                    </div>
                    {coinDiscount > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        <Coins className="w-3 h-3" /> ₹{coinDiscount} discount applied
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right: Order Summary */}
            <div>
              <Card className="sticky top-28">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium flex items-center">
                        <IndianRupee className="w-3 h-3" />{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="flex items-center"><IndianRupee className="w-3 h-3" />{totalPrice}</span>
                  </div>
                  {coinDiscount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Coin Discount</span>
                      <span>-₹{coinDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-primary font-medium">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="flex items-center">
                      <IndianRupee className="w-4 h-4" />{finalAmount}
                    </span>
                  </div>

                  {totalCoins > 0 && (
                    <Badge variant="secondary" className="gap-1 w-full justify-center">
                      <Coins className="w-3 h-3" /> You'll earn {totalCoins} coins
                    </Badge>
                  )}

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={loading || !isFormValid}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Placing Order...</>
                    ) : (
                      <>Place Order — ₹{finalAmount}</>
                    )}
                  </Button>

                  {!isLoggedIn && (
                    <p className="text-xs text-muted-foreground text-center">
                      <button onClick={() => navigate("/auth")} className="text-primary underline">Sign in</button> to use coins & track orders
                    </p>
                  )}
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

export default Checkout;
