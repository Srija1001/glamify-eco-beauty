import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Coins, ShoppingBag, TrendingUp, TrendingDown, User, LogOut, ArrowLeft, Package } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

interface Profile {
  full_name: string;
  email: string;
  total_coins: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

interface Purchase {
  id: string;
  product_name: string;
  product_type: string;
  coins_used: number;
  amount_paid: number;
  payment_method: string;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchProfileData(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchProfileData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfileData = async (userId: string) => {
    setLoading(true);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    const { data: transactionsData } = await supabase
      .from("coin_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (transactionsData) {
      setTransactions(transactionsData);
    }

    const { data: purchasesData } = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (purchasesData) {
      setPurchases(purchasesData);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  const totalEarned = transactions
    .filter((t) => t.type === "earned")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter((t) => t.type === "spent")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gradient-to-b from-background via-accent/5 to-background py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <Skeleton className="h-8 w-20 mb-6" />
            <div className="mb-12">
              <Skeleton className="h-10 w-48 mb-2" />
              <Skeleton className="h-5 w-72" />
            </div>

            {/* Stats cards skeleton */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-40" />
                </Card>
              ))}
            </div>

            {/* Account & Purchases skeleton */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8">
                <Skeleton className="h-7 w-40 mb-6" />
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-12 mb-1" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-12 mb-1" />
                    <Skeleton className="h-6 w-52" />
                  </div>
                </div>
              </Card>
              <Card className="p-8">
                <Skeleton className="h-7 w-44 mb-6" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border-b border-border/50 pb-3 mb-3">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </Card>
            </div>

            {/* Transaction history skeleton */}
            <Card className="p-8">
              <Skeleton className="h-7 w-48 mb-6" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-lg bg-accent/5 mb-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded" />
                    <div>
                      <Skeleton className="h-5 w-40 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-background via-accent/5 to-background py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                My Profile
              </h1>
              <p className="text-lg text-muted-foreground">
                Track your coins, rewards, and purchases
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* My Orders quick link */}
          <Link to="/orders">
            <Card className="p-6 mb-12 shadow-soft hover:shadow-md transition-shadow cursor-pointer border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">My Orders</h2>
                    <p className="text-sm text-muted-foreground">Track your orders and delivery status</p>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
              </div>
            </Card>
          </Link>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 shadow-soft">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Coins</p>
                  <p className="text-3xl font-bold text-primary">{profile?.total_coins || 0}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Use coins for trial packs & discounts</p>
            </Card>

            <Card className="p-6 shadow-soft">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-3xl font-bold text-foreground">{totalEarned}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Coins earned from tube returns</p>
            </Card>

            <Card className="p-6 shadow-soft">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-3xl font-bold text-foreground">{totalSpent}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Coins used for purchases</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Account Details</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold text-foreground">{profile?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-lg font-semibold text-foreground">{profile?.email}</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Recent Purchases</h2>
              </div>
              {purchases.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No purchases yet</p>
              ) : (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="border-b border-border/50 pb-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-foreground">{purchase.product_name}</p>
                        <span className="text-sm text-primary">{purchase.coins_used} coins</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{purchase.product_type}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-muted-foreground">
                          {new Date(purchase.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{purchase.payment_method}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="mb-12">
            <ThemeToggle />
          </div>

          <Card className="p-8 shadow-soft">
            <h2 className="text-2xl font-bold text-foreground mb-6">Transaction History</h2>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center p-4 rounded-lg bg-accent/5 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      {transaction.type === "earned" ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-orange-500" />
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        transaction.type === "earned" ? "text-green-500" : "text-orange-500"
                      }`}
                    >
                      {transaction.type === "earned" ? "+" : ""}
                      {transaction.amount} coins
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
