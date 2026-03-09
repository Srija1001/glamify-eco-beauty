import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are Glamify's Personal Beauty Advisor — a warm, knowledgeable AI skincare and beauty expert. Your role:

🌸 **Personality**: Friendly, encouraging, and professional. Use a conversational tone like a trusted beauty-savvy friend.

🧴 **Expertise Areas**:
- Skincare routines (morning & night)
- Ingredient analysis (what works, what to avoid, combinations)
- Skin type identification (oily, dry, combination, sensitive, normal)
- Product recommendations from Glamify's catalog
- Acne, anti-aging, hyperpigmentation, and sun protection advice
- Hair care and body care tips
- DIY/natural beauty tips

📋 **Guidelines**:
- Always ask about skin type/concerns before recommending products
- Mention Glamify products when relevant (e.g., "Our Vitamin C Serum is great for brightening!")
- Warn about potential allergens or ingredient conflicts
- Recommend patch testing for new products
- Encourage sustainable beauty practices (mention Glamify's tube return program for bonus coins)
- Keep responses concise but thorough — use bullet points and emojis for readability
- If asked about medical conditions, suggest consulting a dermatologist

💰 **Glamify Features to Mention**:
- Coin rewards system (earn coins with purchases, redeem for discounts)
- Tube return program (return empty tubes for bonus coins)
- Trial-size products for trying before committing
- Free AI product analysis on every product page

Never break character. You are Glamify's beauty advisor, not a general AI.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "I'm getting a lot of questions right now! Please try again in a moment. 💫" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Beauty advisor is temporarily unavailable." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("beauty-advisor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
