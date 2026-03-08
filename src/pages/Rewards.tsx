import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Coins, TrendingUp, TrendingDown, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Session } from "@supabase/supabase-js";

const Rewards = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalSpent: 0,
    currentBalance: 0,
    trialProductsPurchased: 0,
    totalPurchases: 0,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      console.error("Error loading profile:", error);
    } else {
      setProfile(data);
    }
  };

  const loadTransactions = async () => {
    const { data, error } = await supabase
      .from("coin_transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading transactions:", error);
    } else {
      setTransactions(data || []);
      
      const earned = data?.filter(t => t.type === "earned").reduce((sum, t) => sum + t.amount, 0) || 0;
      const spent = data?.filter(t => t.type === "spent").reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
      
      setStats(prev => ({
        ...prev,
        totalEarned: earned,
        totalSpent: spent,
        currentBalance: earned - spent,
      }));
    }
  };

  const loadPurchases = async () => {
    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading purchases:", error);
    } else {
      setPurchases(data || []);
      
      const trialProducts = data?.filter(p => p.product_type?.toLowerCase().includes('trial')).length || 0;
      
      setStats(prev => ({
        ...prev,
        trialProductsPurchased: trialProducts,
        totalPurchases: data?.length || 0,
      }));
    }
  };

  useEffect(() => {
    if (session) {
      loadProfile();
      loadTransactions();
      loadPurchases();
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Rewards & Coins Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your coins, rewards, transactions, and purchases
            </p>
          </div>

          {/* Rewards & Coins Overview */}
          <Card className="p-8 mb-12 bg-gradient-to-br from-primary/5 to-primary/10">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Your Rewards & Coins Summary</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Coin Balance:</span>
                  <span className="text-2xl font-bold text-primary">{profile?.total_coins || 0} coins</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Coins Earned:</span>
                  <span className="text-lg font-semibold text-green-500">{stats.totalEarned} coins</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Coins Used:</span>
                  <span className="text-lg font-semibold text-orange-500">{stats.totalSpent} coins</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Trial Products Purchased:</span>
                  <span className="text-2xl font-bold text-primary">{stats.trialProductsPurchased}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Purchases:</span>
                  <span className="text-lg font-semibold text-foreground">{stats.totalPurchases}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Coins Saved:</span>
                  <span className="text-lg font-semibold text-green-500">{stats.totalEarned} coins</span>
                </div>
              </div>
            </div>
            <div className="text-center pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                🌟 Keep returning empty tubes to earn more coins and unlock exclusive trial products!
              </p>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <Coins className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
              <p className="text-4xl font-bold text-primary">{profile?.total_coins || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">coins</p>
            </Card>

            <Card className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Total Earned</p>
              <p className="text-4xl font-bold text-foreground">{stats.totalEarned}</p>
              <p className="text-xs text-muted-foreground mt-1">coins</p>
            </Card>

            <Card className="p-6 text-center">
              <TrendingDown className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Total Spent</p>
              <p className="text-4xl font-bold text-foreground">{stats.totalSpent}</p>
              <p className="text-xs text-muted-foreground mt-1">coins</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Transactions</h2>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No transactions yet
                  </p>
                ) : (
                  transactions.map((transaction) => (
                    <Card key={transaction.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`text-lg font-bold ${
                          transaction.type === "earned" ? "text-green-500" : "text-orange-500"
                        }`}>
                          {transaction.type === "earned" ? "+" : "-"}
                          {Math.abs(transaction.amount)}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Purchase History</h2>
              <div className="space-y-4">
                {purchases.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No purchases yet
                  </p>
                ) : (
                  purchases.map((purchase) => (
                    <Card key={purchase.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <ShoppingBag className="w-10 h-10 text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {purchase.product_name}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {purchase.product_type}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            {purchase.coins_used > 0 && (
                              <span className="text-primary font-semibold">
                                {purchase.coins_used} coins
                              </span>
                            )}
                            {purchase.amount_paid > 0 && (
                              <span className="text-foreground">
                                ₹{purchase.amount_paid}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(purchase.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Rewards;