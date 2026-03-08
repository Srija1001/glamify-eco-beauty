import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Package, Truck, CheckCircle2, Clock, IndianRupee, Coins,
  MapPin, ArrowLeft, ShoppingBag, Loader2, Box
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface OrderItem {
  id: string;
  product_name: string;
  product_type: string;
  quantity: number;
  price: number;
  coins: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  subtotal: number;
  coins_used: number;
  total_paid: number;
  coins_earned: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  created_at: string;
  items?: OrderItem[];
}

const STATUS_STEPS = ["confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Order Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  confirmed: <CheckCircle2 className="w-5 h-5" />,
  processing: <Box className="w-5 h-5" />,
  shipped: <Truck className="w-5 h-5" />,
  out_for_delivery: <Truck className="w-5 h-5" />,
  delivered: <Package className="w-5 h-5" />,
  cancelled: <Clock className="w-5 h-5" />,
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "bg-green-500/10 text-green-600 border-green-200";
    case "cancelled": return "bg-red-500/10 text-red-600 border-red-200";
    case "shipped":
    case "out_for_delivery": return "bg-blue-500/10 text-blue-600 border-blue-200";
    default: return "bg-amber-500/10 text-amber-600 border-amber-200";
  }
};

const getProgressValue = (status: string) => {
  const index = STATUS_STEPS.indexOf(status);
  if (index === -1) return 0;
  return ((index + 1) / STATUS_STEPS.length) * 100;
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map((o: any) => o.id);
        const { data: itemsData } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orderIds);

        const ordersWithItems = ordersData.map((order: any) => ({
          ...order,
          items: (itemsData || []).filter((item: any) => item.order_id === order.id),
        }));

        setOrders(ordersWithItems);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" onClick={() => navigate("/profile")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
          </Button>
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here!</p>
                <Button onClick={() => navigate("/shop")}>Browse Products</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg font-mono">{order.order_number}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold flex items-center">
                          <IndianRupee className="w-4 h-4" />{Number(order.total_paid)}
                        </span>
                        <Badge className={`gap-1 ${getStatusColor(order.status)}`}>
                          {STATUS_ICONS[order.status]}
                          {STATUS_LABELS[order.status] || order.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress tracker */}
                    {order.status !== "cancelled" && (
                      <div className="mt-4">
                        <Progress value={getProgressValue(order.status)} className="h-2" />
                        <div className="flex justify-between mt-2">
                          {STATUS_STEPS.map((step) => (
                            <span
                              key={step}
                              className={`text-[10px] sm:text-xs ${
                                STATUS_STEPS.indexOf(order.status) >= STATUS_STEPS.indexOf(step)
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {STATUS_LABELS[step]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardHeader>

                  {expandedOrder === order.id && (
                    <CardContent className="border-t pt-4 space-y-4">
                      {/* Items */}
                      <div>
                        <h3 className="font-semibold mb-3">Items</h3>
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex justify-between py-2 text-sm">
                            <span>
                              {item.product_name} × {item.quantity}
                              {item.product_type === "trial" && (
                                <Badge variant="outline" className="ml-2 text-xs">Trial</Badge>
                              )}
                            </span>
                            <span className="font-medium flex items-center">
                              <IndianRupee className="w-3 h-3" />{Number(item.price) * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Payment summary */}
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h3 className="font-semibold mb-2">Payment</h3>
                          <p>Method: <span className="capitalize">{order.payment_method === "cod" ? "Cash on Delivery" : "UPI (Razorpay)"}</span></p>
                          <p>Subtotal: ₹{Number(order.subtotal)}</p>
                          {order.coins_used > 0 && (
                            <p className="text-primary">Coins used: -{order.coins_used} (₹{order.coins_used} off)</p>
                          )}
                          <p className="font-semibold">Paid: ₹{Number(order.total_paid)}</p>
                          {order.coins_earned > 0 && (
                            <Badge variant="secondary" className="gap-1 mt-1">
                              <Coins className="w-3 h-3" /> +{order.coins_earned} coins earned
                            </Badge>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> Shipping Address
                          </h3>
                          <p>{order.shipping_name}</p>
                          <p>{order.shipping_street}</p>
                          <p>{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
                          <p>Phone: {order.shipping_phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
