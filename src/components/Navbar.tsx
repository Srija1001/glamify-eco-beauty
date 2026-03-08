import { Button } from "@/components/ui/button";
import { Menu, ShoppingBag, User, Package } from "lucide-react";
import glamifyLogo from "@/assets/glamify-logo.png";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const { totalItems } = useCart();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-soft">
              <img src={glamifyLogo} alt="Glamify logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Glamify
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-foreground hover:text-primary transition-colors font-medium">
              Shop
            </Link>
            <Link to="/tube-return" className="text-foreground hover:text-primary transition-colors font-medium">
              Tube Return
            </Link>
            <Link to="/rewards" className="text-foreground hover:text-primary transition-colors font-medium">
              Rewards & Coins
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </Link>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="w-5 h-5" />
              </Button>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {session ? (
              <>
                <Link to="/orders">
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <Package className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="hidden md:flex">
                  Sign In
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            <Link to="/shop" className="block text-foreground hover:text-primary transition-colors font-medium">
              Shop
            </Link>
            <Link to="/tube-return" className="block text-foreground hover:text-primary transition-colors font-medium">
              Tube Return
            </Link>
            <Link to="/rewards" className="block text-foreground hover:text-primary transition-colors font-medium">
              Rewards & Coins
            </Link>
            <Link to="/about" className="block text-foreground hover:text-primary transition-colors font-medium">
              About
            </Link>
            {session ? (
              <div className="space-y-2">
                <Link to="/orders" className="block text-foreground hover:text-primary transition-colors font-medium">
                  My Orders
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="default" className="w-full">
                    Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/auth" className="block">
                <Button variant="default" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;