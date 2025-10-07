import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          {theme === "dark" ? (
            <Moon className="w-6 h-6 text-primary" />
          ) : (
            <Sun className="w-6 h-6 text-primary" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Appearance</h2>
          <p className="text-sm text-muted-foreground">Choose your theme preference</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button
          variant={theme === "light" ? "default" : "outline"}
          onClick={() => setTheme("light")}
          className="flex-1"
        >
          <Sun className="w-4 h-4 mr-2" />
          Light
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "outline"}
          onClick={() => setTheme("dark")}
          className="flex-1"
        >
          <Moon className="w-4 h-4 mr-2" />
          Dark
        </Button>
      </div>
    </Card>
  );
};

export default ThemeToggle;
