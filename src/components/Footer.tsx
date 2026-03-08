import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground/5 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Glamify
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Sustainable beauty shopping for a better tomorrow.
            </p>
          </div>
          
          {/* Shop */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">All Products</Link></li>
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">Skincare</Link></li>
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">Makeup</Link></li>
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">Haircare</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link to="/tube-return" className="text-muted-foreground hover:text-primary transition-colors text-sm">Sustainability</Link></li>
              <li><Link to="/rewards" className="text-muted-foreground hover:text-primary transition-colors text-sm">Rewards</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">Help Center</Link></li>
              <li><Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors text-sm">Track Order</Link></li>
              <li><Link to="/tube-return" className="text-muted-foreground hover:text-primary transition-colors text-sm">Returns</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Glamify. All rights reserved. Made with ♥ for sustainable beauty.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
