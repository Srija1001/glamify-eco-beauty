import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2, Sparkles, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const ADVISOR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/beauty-advisor`;

const WELCOME_MESSAGE: Msg = {
  role: "assistant",
  content: "Hey gorgeous! 🌸 I'm your Personal Beauty Advisor at Glamify. I can help with skincare routines, product recommendations, ingredient questions, and more!\n\nWhat's on your mind today? Tell me about your skin type or any concerns you have! ✨",
};

const BeautyAdvisorChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Only send user/assistant messages (exclude welcome if it's the default)
    const apiMessages = updatedMessages.map((m) => ({ role: m.role, content: m.content }));

    let assistantText = "";
    const upsert = (chunk: string) => {
      assistantText += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > updatedMessages.length) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantText } : m));
        }
        return [...prev, { role: "assistant", content: assistantText }];
      });
    };

    try {
      const resp = await fetch(ADVISOR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Something went wrong" }));
        upsert(err.error || "Sorry, I'm having trouble right now. Please try again! 💫");
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch {
      upsert("Oops! Something went wrong. Please try again in a moment. 🌷");
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
          aria-label="Open Beauty Advisor"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-3rem)] flex flex-col shadow-2xl border-primary/20 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-accent border-b border-primary/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
              <div>
                <h3 className="font-semibold text-sm text-primary-foreground">Beauty Advisor</h3>
                <p className="text-xs text-primary-foreground/70">Powered by AI ✨</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={clearChat} className="h-8 w-8 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:m-0 [&>ul]:mt-1 [&>ul]:mb-0 [&>ol]:mt-1 [&>ol]:mb-0">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about beauty..."
                className="flex-1 bg-input text-foreground placeholder:text-muted-foreground rounded-full px-4 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="rounded-full h-9 w-9 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
};

export default BeautyAdvisorChat;
