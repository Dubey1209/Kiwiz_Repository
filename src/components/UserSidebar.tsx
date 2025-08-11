import { NavLink } from "react-router-dom";
import { BookOpen, Heart, Home, Palette, Upload, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "My Library", href: "/library", icon: Heart },
    { name: "Tracing Studio", href: "/tracing", icon: BookOpen },
    { name: "AI Coloring", href: "/coloring", icon: Palette },
    { name: "Upload & Illustrate", href: "/upload", icon: Upload },
    { name: "Explore Gallery", href: "/explore", icon: Image },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-card/95 backdrop-blur-lg border-r border-border transition-transform duration-300 ease-in-out overflow-y-auto",
        "md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-8 p-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <span className="text-xl font-bold text-foreground">My Workspace</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-secondary/50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-muted-foreground"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )
              }
              onClick={onClose}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
              {item.name === "My Library" && (
                <span className="ml-auto inline-flex items-center justify-center h-5 px-2 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                  New
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <div className="px-4 py-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Storage: 15% used
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: "15%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
