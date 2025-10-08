-- Insert sample reviews for existing products
INSERT INTO public.product_reviews (product_id, user_name, rating, comment, review_date)
SELECT p.id, 'Priya Sharma', 5, 'Amazing product! My skin feels so hydrated and plump. Worth every rupee.', '2025-01-15'
FROM public.products p WHERE p.name = 'Hydrating Face Serum - Premium' LIMIT 1;

INSERT INTO public.product_reviews (product_id, user_name, rating, comment, review_date)
SELECT p.id, 'Anjali Patel', 4, 'Great serum, absorbs quickly. Noticed visible difference in my skin texture.', '2025-01-10'
FROM public.products p WHERE p.name = 'Hydrating Face Serum - Premium' LIMIT 1;

INSERT INTO public.product_reviews (product_id, user_name, rating, comment, review_date)
SELECT p.id, 'Riya Gupta', 5, 'Best serum I''ve used! My fine lines are visibly reduced.', '2025-01-05'
FROM public.products p WHERE p.name = 'Hydrating Face Serum - Premium' LIMIT 1;

INSERT INTO public.product_reviews (product_id, user_name, rating, comment, review_date)
SELECT p.id, 'Meera Reddy', 5, 'My dark spots have faded significantly! Highly recommend this cream.', '2025-01-18'
FROM public.products p WHERE p.name = 'Vitamin C Brightening Cream - Professional' LIMIT 1;

INSERT INTO public.product_reviews (product_id, user_name, rating, comment, review_date)
SELECT p.id, 'Kavita Singh', 5, 'Excellent product for brightening. My skin glows now!', '2025-01-12'
FROM public.products p WHERE p.name = 'Vitamin C Brightening Cream - Professional' LIMIT 1;

INSERT INTO public.product_reviews (product_id, user_name, rating, comment, review_date)
SELECT p.id, 'Neha Kapoor', 4, 'Good results after 3 weeks of use. Skin tone is more even.', '2025-01-08'
FROM public.products p WHERE p.name = 'Vitamin C Brightening Cream - Professional' LIMIT 1;