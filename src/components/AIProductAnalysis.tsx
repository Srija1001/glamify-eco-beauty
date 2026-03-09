import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Product {
  name: string;
  description: string;
  ingredients: string;
  benefits: string[];
  suitable_for: string;
  size: string;
  is_trial: boolean | null;
}

interface AIProductAnalysisProps {
  product: Product;
}

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-product`;

const AIProductAnalysis = ({ product }: AIProductAnalysisProps) => {
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const analyze = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysis("");
    setHasAnalyzed(true);

    try {
      const resp = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ product }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Analysis failed" }));
        throw new Error(err.error || "Analysis failed");
      }

      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setAnalysis(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      toast({
        title: "Analysis Error",
        description: e instanceof Error ? e.message : "Could not analyze product",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [product]);

  const reset = () => {
    setAnalysis("");
    setHasAnalyzed(false);
  };

  if (!hasAnalyzed) {
    return (
      <Button
        onClick={analyze}
        variant="outline"
        className="w-full gap-2 border-primary/30 hover:bg-primary/5 text-primary"
        size="lg"
      >
        <Sparkles className="w-5 h-5" />
        AI Product Analysis
      </Button>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-primary/20 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Product Analysis</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={reset} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {isAnalyzing && !analysis && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Analyzing product...</span>
        </div>
      )}

      {analysis && (
        <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
          {analysis.split("\n").map((line, i) => {
            if (line.startsWith("### ")) return <h4 key={i} className="text-base font-semibold mt-3 mb-1 text-foreground">{line.slice(4)}</h4>;
            if (line.startsWith("## ")) return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-foreground">{line.slice(3)}</h3>;
            if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold mt-3 mb-1 text-foreground">{line.slice(2, -2)}</p>;
            if (line.startsWith("- ") || line.startsWith("* ")) return <p key={i} className="ml-4 text-muted-foreground">• {renderBold(line.slice(2))}</p>;
            if (line.trim() === "") return <div key={i} className="h-2" />;
            return <p key={i} className="text-muted-foreground">{renderBold(line)}</p>;
          })}
          {isAnalyzing && <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-1" />}
        </div>
      )}
    </Card>
  );
};

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="text-foreground">{part.slice(2, -2)}</strong>
      : part
  );
}

export default AIProductAnalysis;
