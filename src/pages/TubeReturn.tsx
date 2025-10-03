import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

const TubeReturn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [returns, setReturns] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session) {
      loadReturns();
    }
  }, [session]);

  const loadReturns = async () => {
    const { data, error } = await supabase
      .from("tube_returns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading returns:", error);
    } else {
      setReturns(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setLoading(true);

    const { error } = await supabase.from("tube_returns").insert({
      user_id: session.user.id,
      product_name: productName,
      image_url: imageUrl,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Tube submitted successfully!",
        description: "Your tube return is under verification.",
      });
      setProductName("");
      setImageUrl("");
      loadReturns();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tube Return Portal
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload photos of your empty beauty tubes and earn coins!
            </p>
          </div>

          <Card className="p-8 mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Radiant Glow Serum"
                  required
                />
              </div>

              <div>
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your image to a service like Imgur and paste the URL here
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <Upload className="w-4 h-4 mr-2" />
                {loading ? "Submitting..." : "Submit Tube Return"}
              </Button>
            </form>
          </Card>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Submissions</h2>
            <div className="space-y-4">
              {returns.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No submissions yet. Start returning tubes to earn coins!
                </p>
              ) : (
                returns.map((returnItem) => (
                  <Card key={returnItem.id} className="p-6">
                    <div className="flex items-start gap-4">
                      {returnItem.image_url && (
                        <img
                          src={returnItem.image_url}
                          alt={returnItem.product_name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {returnItem.product_name}
                          </h3>
                          {getStatusIcon(returnItem.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Status: <span className="capitalize">{returnItem.status}</span>
                        </p>
                        {returnItem.coins_earned > 0 && (
                          <p className="text-sm font-semibold text-primary">
                            Coins Earned: {returnItem.coins_earned}
                          </p>
                        )}
                        {returnItem.verification_notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Note: {returnItem.verification_notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TubeReturn;