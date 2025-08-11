import { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-sm">
          {user.name.charAt(0).toUpperCase()}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg border border-[#898AC4] overflow-hidden z-50" style={{ backgroundColor: '#898AC4' }}>
          <div className="py-1">
            <div className="px-4 py-3 border-b border-[#A8A9D9]">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-white/80 truncate">{user.email}</p>
            </div>
            

            
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#A8A9D9] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-3" />
              My Profile
            </Link>
            
            <div className="border-t border-[#A8A9D9] my-1"></div>
            
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-white hover:bg-[#A8A9D9] transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
