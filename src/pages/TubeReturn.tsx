import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Upload, CheckCircle, Clock, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface TubeReturn {
  id: string;
  product_name: string;
  image_url: string;
  status: string;
  coins_earned: number;
  created_at: string;
  verification_notes: string | null;
}

const TubeReturn = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [productName, setProductName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [returns, setReturns] = useState<TubeReturn[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchReturns(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchReturns(session.user.id);
      } else {
        setUser(null);
        setReturns([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchReturns = async (userId: string) => {
    const { data, error } = await supabase
      .from("tube_returns")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReturns(data);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to submit your tube return",
      });
      navigate("/auth");
      return;
    }
    
    if (!productName || !imageFile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and upload an image",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("tube_returns").insert({
      user_id: user.id,
      product_name: productName,
      image_url: imagePreview,
      status: "pending",
    });

    if (error) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Tube Submitted Successfully!",
        description: "Your tube return is being verified. You'll receive coins once approved.",
      });
      setProductName("");
      setImageFile(null);
      setImagePreview("");
      fetchReturns(user.id);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "Pending Verification";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-background via-accent/5 to-background py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tube Return
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload photos of your empty beauty tubes and earn coins for sustainable recycling
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 shadow-soft">
              <h2 className="text-2xl font-bold text-foreground mb-6">Submit Empty Tube</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Moisturizer Tube, Face Serum"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tubeImage">Upload Tube Image</Label>
                  <div className="mt-2">
                    <Input
                      id="tubeImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {loading ? "Submitting..." : "Submit for Verification"}
                </Button>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Guidelines:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Tube must be completely empty</li>
                    <li>• Label should be clearly visible</li>
                    <li>• Clean the tube before photographing</li>
                    <li>• Take photos in good lighting</li>
                  </ul>
                </div>
              </form>
            </Card>

            <Card className="p-8 shadow-soft">
              <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Upload Photo</h3>
                    <p className="text-sm text-muted-foreground">
                      Take a clear photo of your empty tube with the label visible
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Our delivery partners verify the tube's material and condition
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Collection</h3>
                    <p className="text-sm text-muted-foreground">
                      Once approved, we'll collect the tube from your doorstep
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Earn Coins</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive 50 coins instantly for each verified tube
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {user && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Your Submissions</h2>
              {returns.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No tube returns yet. Submit your first tube to get started!</p>
                </Card>
              ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {returns.map((returnItem) => (
                  <Card key={returnItem.id} className="p-6 shadow-soft">
                    <img
                      src={returnItem.image_url}
                      alt={returnItem.product_name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-foreground mb-2">{returnItem.product_name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(returnItem.status)}
                      <span className="text-sm text-muted-foreground">{getStatusText(returnItem.status)}</span>
                    </div>
                    {returnItem.status === "approved" && (
                      <p className="text-sm text-primary font-semibold">+{returnItem.coins_earned} coins earned</p>
                    )}
                    {returnItem.verification_notes && (
                      <p className="text-sm text-muted-foreground mt-2">{returnItem.verification_notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Submitted: {new Date(returnItem.created_at).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TubeReturn;
