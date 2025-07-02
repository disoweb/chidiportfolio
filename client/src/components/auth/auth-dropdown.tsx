import { useState, useEffect } from "react";
import { User, LogIn, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface AuthDropdownProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function AuthDropdown({ onLoginClick, onRegisterClick }: AuthDropdownProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("clientSessionToken");
    if (token) {
      // Verify token and get user info
      fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionToken: token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setIsAuthenticated(true);
            setUserName(data.user.firstName);
          } else {
            localStorage.removeItem("clientSessionToken");
          }
        })
        .catch(() => {
          localStorage.removeItem("clientSessionToken");
        });
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("clientSessionToken");
    if (token) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionToken: token }),
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    
    localStorage.removeItem("clientSessionToken");
    setIsAuthenticated(false);
    setUserName("");
    
    // Redirect to home page
    window.location.href = "/";
  };

  const handleDashboardClick = () => {
    window.location.href = "/client/dashboard";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          {isAuthenticated ? userName : "Account"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isAuthenticated ? (
          <>
            <DropdownMenuItem onClick={handleDashboardClick}>
              <User className="w-4 h-4 mr-2" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={onLoginClick}>
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRegisterClick}>
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}