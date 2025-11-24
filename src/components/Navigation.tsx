import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, LayoutDashboard, Menu, X, Moon, Sun, User } from "lucide-react";
import { useState, useEffect } from "react";

interface NavigationProps {
  user?: {
    firstName: string;
    lastName?: string;
    avatar?: string;
  };
}

const Navigation = ({ user }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-[var(--shadow-glow)] transition-all group-hover:scale-110">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              The Speaker Platform
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/events" className="text-foreground hover:text-primary transition-colors font-medium">
              Events
            </Link>
            <Link to="/speakers" className="text-foreground hover:text-primary transition-colors font-medium">
              Speakers
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          {/* Desktop Auth / Profile / Theme */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-foreground hover:text-primary relative"
            >
              <Sun
                className={`h-5 w-5 transition-all ${theme === "light" ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}
              />
              <Moon
                className={`absolute h-5 w-5 transition-all ${theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"}`}
              />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {user ? (
              <Link to="/profile" className="flex items-center gap-2 text-foreground hover:text-primary">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.firstName} className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-6 h-6" />
                )}
                <span>{user.firstName}</span>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in">
          <div className="px-4 py-6 space-y-4">
            <Link to="/events" className="block text-foreground hover:text-primary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              Events
            </Link>
            <Link to="/speakers" className="block text-foreground hover:text-primary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              Speakers
            </Link>
            <Link to="/dashboard" className="block text-foreground hover:text-primary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>

            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full" onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}>
                Toggle Theme
              </Button>
              {user ? (
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-primary text-primary-foreground">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
