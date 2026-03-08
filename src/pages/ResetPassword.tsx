import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Sparkles, CheckCircle2 } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSuccess(true);
      toast({
        title: "Password Updated!",
        description: "Your password has been reset successfully.",
      });
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Password Reset Complete</h1>
          <p className="text-muted-foreground mb-6">You can now sign in with your new password.</p>
          <Button onClick={() => navigate("/")} className="w-full">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Reset Link</h1>
          <p className="text-muted-foreground mb-6">
            This link is invalid or has expired. Please request a new password reset.
          </p>
          <Button onClick={() => navigate("/auth")} className="w-full">
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Glamify</h1>
          </div>
          <p className="text-muted-foreground">Set your new password</p>
        </div>

        <div className="bg-card rounded-2xl shadow-soft p-8 border-2 border-border/50">
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
