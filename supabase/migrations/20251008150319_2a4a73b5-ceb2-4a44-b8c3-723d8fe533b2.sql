-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits TEXT[] NOT NULL DEFAULT '{}',
  price INTEGER NOT NULL,
  coins INTEGER NOT NULL,
  image TEXT,
  size TEXT NOT NULL,
  quantity TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  suitable_for TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  is_trial BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for products (publicly readable)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Create policies for product reviews (publicly readable)
CREATE POLICY "Product reviews are viewable by everyone" 
ON public.product_reviews 
FOR SELECT 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample products
INSERT INTO public.products (name, description, benefits, price, coins, image, size, quantity, ingredients, suitable_for, rating, is_trial) VALUES
('Hydrating Face Serum - Premium', 'A lightweight, fast-absorbing serum enriched with hyaluronic acid and vitamin B5. Perfect for all skin types, especially dry and dehydrated skin. Provides 24-hour hydration, plumps fine lines, and creates a smooth base for makeup.', ARRAY['24-hour hydration', 'Reduces fine lines', 'Suitable for all skin types', 'Vegan & cruelty-free'], 1499, 900, '/placeholder.svg', '100ml', '1 Bottle (100ml)', 'Hyaluronic Acid, Vitamin B5, Glycerin, Aloe Vera', 'All skin types, especially dry and dehydrated skin', 4.7, false),
('Vitamin C Brightening Cream - Professional', 'An intensive brightening cream with 15% pure vitamin C, niacinamide, and natural extracts. Targets dark spots, evens skin tone, and boosts radiance. The antioxidant-rich formula protects against environmental damage while promoting collagen production.', ARRAY['Brightens complexion', 'Reduces dark spots', 'Anti-aging properties', 'Protects from free radicals'], 1799, 1040, '/placeholder.svg', '100ml', '1 Jar (100ml)', 'Vitamin C (15%), Niacinamide, Vitamin E, Ferulic Acid', 'Dull, uneven skin tone, hyperpigmentation, mature skin', 4.8, false),
('Gentle Exfoliating Cleanser - Family Size', 'A creamy, pH-balanced cleanser with gentle AHA/BHA blend that removes makeup, dirt, and dead skin cells without stripping natural oils. Leaves skin soft, clean, and refreshed. Perfect for daily use, morning and evening.', ARRAY['Deep cleansing', 'Gentle exfoliation', 'Maintains skin barrier', 'Non-drying formula'], 999, 560, '/placeholder.svg', '250ml', '1 Tube (250ml)', 'Glycolic Acid (AHA), Salicylic Acid (BHA), Chamomile Extract, Jojoba Oil', 'All skin types, acne-prone, combination skin', 4.6, false),
('Overnight Recovery Mask - Luxury Edition', 'A luxurious overnight mask infused with retinol, peptides, and botanical oils. Works while you sleep to repair, regenerate, and rejuvenate skin. Wake up to smoother, firmer, and more radiant skin. Clinically proven to reduce wrinkles by 30% in 4 weeks.', ARRAY['Reduces wrinkles', 'Firms skin', 'Deep overnight repair', 'Improves texture'], 2299, 1360, '/placeholder.svg', '150ml', '1 Jar (150ml)', 'Retinol, Peptide Complex, Squalane, Rosehip Oil, Ceramides', 'Mature skin, fine lines, uneven texture', 4.9, false),
('Trial Set - Hydration Essentials', 'Experience our bestselling hydration routine with this complete trial set. Includes mini sizes of our hydrating cleanser, serum, and moisturizer. Perfect for 7 days of use or travel. A great way to test our products before committing to full sizes.', ARRAY['Complete routine', '7-day supply', 'Travel-friendly', 'Perfect for testing'], 299, 300, '/placeholder.svg', '3 x 10ml each', '3 Mini Bottles (30ml total)', 'See individual products', 'All skin types, first-time users', 4.5, true),
('Trial Set - Anti-Aging Collection', 'Discover the power of our anti-aging line with this curated trial set. Contains sample sizes of vitamin C serum, retinol cream, and eye cream. Each product works synergistically to combat signs of aging and boost radiance.', ARRAY['Complete anti-aging routine', '10-day supply', 'Synergistic formulas', 'Visible results'], 399, 400, '/placeholder.svg', '3 x 15ml each', '3 Mini Containers (45ml total)', 'See individual products', 'Mature skin, anti-aging focus, 30+', 4.7, true),
('Trial Set - Acne Solution Kit', 'Target breakouts with our specially formulated acne solution kit. Includes a gentle cleanser with salicylic acid, spot treatment, and oil-free moisturizer. Formulated to clear skin without over-drying or irritation.', ARRAY['Clears breakouts', 'Prevents new acne', 'Balances oil', 'Non-irritating'], 349, 360, '/placeholder.svg', '3 x 12ml each', '3 Mini Products (36ml total)', 'See individual products', 'Acne-prone, oily, combination skin, teens and adults', 4.6, true),
('Trial Set - Sensitive Skin Care', 'Gentle yet effective care for sensitive skin. This trial set features our fragrance-free, hypoallergenic cleanser, calming toner, and barrier repair cream. Dermatologist-tested and formulated to soothe irritation and strengthen skin''s natural barrier.', ARRAY['Soothes irritation', 'Strengthens barrier', 'Fragrance-free', 'Dermatologist-tested'], 319, 320, '/placeholder.svg', '3 x 10ml each', '3 Mini Bottles (30ml total)', 'See individual products', 'Sensitive, reactive, rosacea-prone skin', 4.8, true);