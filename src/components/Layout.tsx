import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Palette, Upload, BookOpen, Heart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserSidebar } from "./UserSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { UserDropdown } from "./UserDropdown";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Navigation items for all users (desktop)
  const publicNavigation = [
    { name: "Home", href: "/" },
    { name: "Tracing Studio", href: "/tracing" },
    { name: "AI Coloring", href: "/coloring" },
    { name: "Explore", href: "/explore" },
  ];

  // Navigation items for authenticated users (desktop)
  const authNavigationDesktop = [
    { name: "Upload & Illustrate", href: "/upload" },
  ];

  // Navigation items for mobile menu
  const mobileNavigation = [
    ...publicNavigation,
    { name: "Upload & Illustrate", href: "/upload" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];
  
  // Navigation items for authenticated users (shown in sidebar)
  const authNavigation = [
    { name: "My Library", href: "/library", icon: Heart },
  ];
  


  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-6">
            {/* Logo */}
            <NavLink to="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">✦</span>
              </div>
              <span className="ml-2 text-xl font-bold hidden sm:inline">Kiwiz</span>
            </NavLink>

            {/* Desktop Navigation - Show public items to all, add Upload for authenticated */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Public navigation items */}
              {publicNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              
              {/* Auth-only navigation items */}
              {isAuthenticated && authNavigationDesktop.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Auth/User Controls */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Desktop - User Dropdown */}
                <div className="hidden md:flex items-center gap-4">
                  <UserDropdown />
                </div>
                
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </>
            ) : (
              <>
                {/* Desktop - Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                  <NavLink to="/login">
                    <Button variant="ghost" className="text-sm">
                      Sign In
                    </Button>
                  </NavLink>
                  <NavLink to="/auth">
                    <Button className="text-sm">
                      Create Account
                    </Button>
                  </NavLink>
                </div>
                
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-card/95 backdrop-blur-lg z-40 border-t border-border overflow-y-auto">
            <nav className="px-4 py-6 space-y-1">
              {mobileNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary/50"
                    )
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-4 mt-4 border-t border-border space-y-2">
                  <NavLink
                    to="/login"
                    className="block w-full px-4 py-2.5 text-center text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/auth"
                    className="block w-full px-4 py-2.5 text-center text-sm font-medium rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Account
                  </NavLink>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* User Sidebar - Only show when authenticated */}
        {isAuthenticated && (
          <div className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] z-30">
            <UserSidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
            />
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {isAuthenticated && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Mobile Sidebar */}
        {isAuthenticated && (
          <div className="md:hidden">
            <UserSidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Mobile header for authenticated users */}
          {isAuthenticated && (
            <div className="md:hidden sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center p-4 border-b border-border">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">
                {location.pathname.includes('library') ? 'My Library' : 'Dashboard'}
              </h1>
            </div>
          )}
          
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">✦</span>
                </div>
                <span className="text-xl font-bold text-foreground">Kiwiz</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Unlock joyful learning and creativity for toddlers through playful digital experiences.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Features</h3>
              <div className="space-y-2">
                <a href="/tracing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Tracing Studio</a>
                <a href="/coloring" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">AI Coloring</a>
                <a href="/upload" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Upload & Illustrate</a>
                <a href="/explore" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Explore Gallery</a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <div className="space-y-2">
                <a href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</a>
                <a href="/billing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Facebook</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Instagram</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">YouTube</a>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Kiwiz. All rights reserved. Made with ❤️ for little learners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;