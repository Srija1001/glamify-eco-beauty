import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, LogOut } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [profile, setProfile] = useState<any>(null);

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
      loadProfile();
    }
  }, [session]);

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session?.user.id)
      .single();

    if (error) {
      console.error("Error loading profile:", error);
    } else {
      setProfile(data);
      setFullName(data.full_name || "");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("user_id", session.user.id);

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      loadProfile();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Your Profile</h1>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>

          <Card className="p-8 mb-6">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={session.user.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div>
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <Label>Total Coins</Label>
                <div className="text-3xl font-bold text-primary mt-2">
                  {profile?.total_coins || 0} coins
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </Card>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;