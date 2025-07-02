import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  CalendarDays,
  Clock,
  DollarSign,
  MessageSquare,
  User,
  Mail,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Target,
  LogOut,
  Search,
  CreditCard,
  Bell,
  Menu,
  Home,
  Settings,
  Eye,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { ProjectBookingModal } from "@/components/booking/project-booking-modal";
import { ServiceCheckout } from "@/components/checkout/service-checkout";

// Type definitions
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  startDate: string;
  dueDate: string;
  clientEmail: string;
  budget: string;
  assignedTo: string;
  createdAt: string;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  service: string;
  projectType: string;
  budget: string;
  timeline: string;
  paymentStatus: string;
  createdAt: string;
}

interface PaymentLog {
  id: number;
  amount: string;
  status: string;
  reference: string;
  serviceName: string;
  paidAt: string;
  createdAt: string;
}

interface Message {
  id: number;
  subject: string;
  message: string;
  senderType: string;
  isRead: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalSpent: number;
}

interface DashboardData {
  user: User;
  projects: Project[];
  bookings: Booking[];
  paymentLogs: PaymentLog[];
  unreadMessages: Message[];
  stats: DashboardStats;
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface RegisterData extends AuthCredentials {
  firstName: string;
  lastName: string;
  phone?: string;
}

// API error response type
interface ApiErrorResponse {
  error?: string;
  message?: string;
}

// Constants
const REFETCH_INTERVAL = 30000; // 30 seconds
const MAX_PROJECT_DESCRIPTION_LENGTH = 100;

/**
 * Client Dashboard Component
 *
 * Provides a comprehensive view of client projects, bookings, payments, and messages
 * with authentication and project tracking functionality.
 */
export default function ClientDashboard() {
  const [sessionToken, setSessionToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<AuthCredentials>({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [projectTrackingId, setProjectTrackingId] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectBookingModalOpen, setIsProjectBookingModalOpen] = useState<boolean>(false);
  const [isServiceCheckoutOpen, setIsServiceCheckoutOpen] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState<string>("overview");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Verify session token validity
   */
  const verifySession = useCallback(async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionToken: token }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Session verification failed");
      }

      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        setSessionToken(token);
      } else {
        throw new Error("Invalid session response");
      }
    } catch (error) {
      console.error("Session verification error:", error);
      localStorage.removeItem("clientSessionToken");
      setIsAuthenticated(false);
      setSessionToken("");
      
      // Only show toast for actual authentication errors, not silent re-auth failures
      if (error instanceof Error && !error.message.includes("verification failed")) {
        handleAuthError(error);
      }
    }
  }, []);

  // Check for existing session on component mount and handle URL parameters
  useEffect(() => {
    // Check for email parameter in URL (from booking redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    
    if (emailParam) {
      // Pre-fill both login and register forms with email from booking
      setLoginData(prev => ({ ...prev, email: emailParam }));
      setRegisterData(prev => ({ ...prev, email: emailParam }));
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    const token = localStorage.getItem("clientSessionToken");
    if (token) {
      setSessionToken(token);
      verifySession(token);
    }
  }, [verifySession]);

  /**
   * Handle authentication errors consistently
   */
  const handleAuthError = (error: unknown) => {
    let errorMessage = "An authentication error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    toast({
      title: "Authentication Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  /**
   * Login mutation handler
   */
  const loginMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      if (!credentials.email || !credentials.password) {
        throw new Error("Email and password are required");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        throw new Error("Please enter a valid email address");
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid email or password. Please check your credentials and try again.");
        } else if (response.status === 400) {
          throw new Error(data.error || "Please fill in all required fields");
        } else if (response.status >= 500) {
          throw new Error("Server error. Please try again in a few moments.");
        }
        throw new Error(data.error || `Login failed with status ${response.status}`);
      }

      if (!data.success || !data.sessionToken) {
        throw new Error("Invalid login response format");
      }

      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("clientSessionToken", data.sessionToken);
      setSessionToken(data.sessionToken);
      setIsAuthenticated(true);
      setLoginData({ email: "", password: "" }); // Clear form
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.firstName}!`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      handleAuthError(error);
    },
  });

  /**
   * Registration mutation handler
   */
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName || !userData.phone) {
        throw new Error("All fields are required for registration: First Name, Last Name, Email, Phone, and Password");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate password strength
      if (userData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If user already exists, suggest they login instead
        if (response.status === 400 && data.error?.includes("already exists")) {
          throw new Error("An account with this email already exists. Please try logging in instead, or contact support if you need help accessing your account.");
        }
        throw new Error(data.error || `Registration failed: ${response.status}`);
      }

      if (!data.success || !data.sessionToken) {
        throw new Error("Invalid registration response format");
      }

      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("clientSessionToken", data.sessionToken);
      setSessionToken(data.sessionToken);
      setIsAuthenticated(true);
      setRegisterData({ email: "", password: "", firstName: "", lastName: "", phone: "" }); // Clear form
      toast({
        title: "Registration Successful",
        description: `Welcome, ${data.user.firstName}! Your account has been created.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
      handleAuthError(error);
    },
  });

  /**
   * Dashboard data query
   */
  const {
    data: dashboardData,
    isLoading,
    error: dashboardError,
  } = useQuery<DashboardData>({
    queryKey: ["dashboard", sessionToken],
    queryFn: async () => {
      const response = await fetch(`/api/user/dashboard/${sessionToken}`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.message || "Failed to fetch dashboard data");
      }

      return response.json();
    },
    enabled: !!sessionToken && isAuthenticated,
    refetchInterval: REFETCH_INTERVAL,
    retry: 2,
    staleTime: 10000,
  });

  // Effect to populate profile data when dashboard loads
  useEffect(() => {
    if (dashboardData?.user) {
      setProfileData({
        firstName: dashboardData.user.firstName || '',
        lastName: dashboardData.user.lastName || '',
        email: dashboardData.user.email || '',
        phone: dashboardData.user.phone || '',
      });
    }
  }, [dashboardData]);

  /**
   * Project tracking mutation
   */
  const trackProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/track-project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.message || "Project not found");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setSelectedProject(data.project);
      toast({
        title: "Project Found",
        description: `Tracking project: ${data.project.name}`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Project Not Found",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  /**
   * Profile update mutation
   */
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const response = await fetch(`/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', sessionToken] });
      setIsEditingProfile(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  /**
   * Password change mutation
   */
  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordData) => {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      const response = await fetch(`/api/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      return response.json();
    },
    onSuccess: () => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Password Change Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  /**
   * Logout handler
   */
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ sessionToken }),
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all auth-related state
      localStorage.removeItem("clientSessionToken");
      setSessionToken("");
      setIsAuthenticated(false);
      setLoginData({ email: "", password: "" });
      setRegisterData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
      });
      queryClient.clear();

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "default",
      });

      // Redirect to home page
      window.location.href = "/";
    }
  }, [sessionToken, queryClient, toast]);

  /**
   * Get color class for project status
   */
  const getStatusColor = useCallback((status: string): string => {
    const statusColors: Record<string, string> = {
      completed: "bg-green-500",
      "in-progress": "bg-blue-500",
      testing: "bg-yellow-500",
      planning: "bg-purple-500",
      "on-hold": "bg-red-500",
      default: "bg-gray-500",
    };

    return statusColors[status] || statusColors.default;
  }, []);

  /**
   * Get variant for priority badge
   */
  const getPriorityColor = useCallback((priority: string) => {
    const priorityVariants: Record<string, string> = {
      high: "destructive",
      medium: "default",
      low: "secondary",
      default: "outline",
    };

    return priorityVariants[priority] || priorityVariants.default;
  }, []);

  /**
   * Format date string
   */
  const formatDate = useCallback((dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  }, []);

  /**
   * Format currency
   */
  const formatCurrency = useCallback((amount: string | number): string => {
    const amountNumber =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amountNumber);
  }, []);

  /**
   * Truncate text with ellipsis
   */
  const truncateText = useCallback(
    (text: string, maxLength: number): string => {
      return text.length > maxLength
        ? `${text.substring(0, maxLength)}...`
        : text;
    },
    [],
  );

  // Render authentication form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isLoginMode ? "Client Login" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLoginMode
                ? "Access your project dashboard"
                : "Sign up to track your projects"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Show helpful message for users from booking redirect */}
            {loginData.email && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <p className="font-semibold mb-1">First time logging in?</p>
                    <p>If you just submitted a booking, you'll need to create an account first. Click "Create Account" below to set up your password.</p>
                  </div>
                </div>
              </div>
            )}
            
            {isLoginMode ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  loginMutation.mutate(loginData);
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                    autoComplete="email"
                    autoCorrect="off"
                    autoCapitalize="none"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                    minLength={6}
                    autoComplete="current-password"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  registerMutation.mutate(registerData);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={registerData.firstName}
                      onChange={(e) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      required
                      autoComplete="given-name"
                      autoCapitalize="words"
                      style={{ fontSize: '16px' }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={registerData.lastName}
                      onChange={(e) =>
                        setRegisterData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                    minLength={8}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}

                >
                  {registerMutation.isPending
                    ? "Creating Account..."
                    : "Sign Up"}
                </Button>
              </form>
            )}

            <Separator />

            {/* Project Tracking by ID */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Track Project by ID</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter project ID"
                  value={projectTrackingId}
                  onChange={(e) => setProjectTrackingId(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => trackProjectMutation.mutate(projectTrackingId)}
                  disabled={
                    !projectTrackingId || trackProjectMutation.isPending
                  }

                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsLoginMode(!isLoginMode)}
            >
              {isLoginMode
                ? "Need an account? Sign up"
                : "Already have an account? Login"}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800"
                onClick={() => window.location.href = '/'}
              >
                ← Back to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardError || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="text-center p-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-gray-600 mb-4">
              {dashboardError instanceof Error
                ? dashboardError.message
                : "Failed to load your dashboard data."}
            </p>
            <Button onClick={logout}>Logout and Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Dashboard Header with Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Dashboard Navigation</SheetTitle>
                    <SheetDescription>
                      Navigate through your dashboard sections
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <nav className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start gap-3 text-left"
                        onClick={() => setActiveTab("overview")}
                      >
                        <Home className="h-4 w-4" />
                        Overview
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start gap-3 text-left"
                        onClick={() => setActiveTab("projects")}
                      >
                        <Briefcase className="h-4 w-4" />
                        Projects
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start gap-3 text-left"
                        onClick={() => setActiveTab("bookings")}
                      >
                        <CalendarDays className="h-4 w-4" />
                        Bookings
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start gap-3 text-left"
                        onClick={() => setActiveTab("messages")}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Messages
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start gap-3 text-left"
                        onClick={() => setActiveTab("profile")}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Button>
                      <Separator className="my-2" />
                      <Button
                        variant="ghost"
                        className="justify-start gap-3 text-left text-red-600 hover:text-red-700"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Client Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {dashboardData.user.firstName}!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {dashboardData.unreadMessages.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative p-2"
                  onClick={() => setActiveTab("messages")}
                >
                  <Bell className="h-5 w-5 text-gray-500" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {dashboardData.unreadMessages.length}
                  </span>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("profile")}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">

        {/* Quick Actions Section - Mobile Optimized */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={() => setIsProjectBookingModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 h-auto min-h-[48px] touch-manipulation flex-1 sm:flex-none sm:w-auto"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Create New Project
            </Button>
            <Button
              onClick={() => setIsServiceCheckoutOpen(true)}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-3 h-auto min-h-[48px] touch-manipulation flex-1 sm:flex-none sm:w-auto"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Order a Service
            </Button>
          </div>
        </section>

        {/* Stats Overview Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Briefcase className="h-6 w-6 text-blue-600" />}
            title="Total Projects"
            value={dashboardData.stats.totalProjects}
          />

          <StatCard
            icon={<Clock className="h-6 w-6 text-yellow-600" />}
            title="Active Projects"
            value={dashboardData.stats.activeProjects}
          />

          <StatCard
            icon={<CheckCircle className="h-6 w-6 text-green-600" />}
            title="Completed"
            value={dashboardData.stats.completedProjects}
          />

          <StatCard
            icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
            title="Total Spent"
            value={formatCurrency(dashboardData.stats.totalSpent)}
          />
        </section>

        {/* Main Content Section */}
        <section>
          {/* Show different content based on activeTab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* This is the default view showing stats and quick actions */}
              <div className="text-center py-4">
                <p className="text-gray-600">Your projects and activities overview is displayed above.</p>
              </div>
            </div>
          )}
          
          {activeTab !== "overview" && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              {dashboardData.projects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {dashboardData.projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewDetails={() => setSelectedProject(project)}
                      getStatusColor={getStatusColor}
                      getPriorityColor={getPriorityColor}
                      formatDate={formatDate}
                      truncateText={truncateText}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Briefcase className="w-16 h-16 text-gray-400" />}
                  title="No Projects Yet"
                  description="You don't have any projects yet. Book a service to get started!"
                  action={
                    <Button
                      onClick={() => setIsProjectBookingModalOpen(true)}
                    >
                      Book Private Consultation
                    </Button>
                  }
                />
              )}
            </TabsContent>



            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              {dashboardData.bookings.length > 0 ? (
                <div className="grid gap-4">
                  {dashboardData.bookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<CalendarDays className="w-16 h-16 text-gray-400" />}
                  title="No Bookings Yet"
                  description="Your service bookings will appear here."
                />
              )}
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-4">
              {dashboardData.paymentLogs.length > 0 ? (
                <div className="grid gap-4">
                  {dashboardData.paymentLogs.map((payment) => (
                    <PaymentCard
                      key={payment.id}
                      payment={payment}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<CreditCard className="w-16 h-16 text-gray-400" />}
                  title="No Payment History"
                  description="Your payment transactions will appear here."
                />
              )}
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              {dashboardData.unreadMessages.length > 0 ? (
                <div className="grid gap-4">
                  {dashboardData.unreadMessages.map((message) => (
                    <MessageCard
                      key={message.id}
                      message={message}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<MessageSquare className="w-16 h-16 text-gray-400" />}
                  title="No Messages"
                  description="Messages from your project team will appear here."
                />
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Profile Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Profile Information
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                      >
                        {isEditingProfile ? 'Cancel' : 'Edit'}
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Manage your personal information and contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditingProfile ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          updateProfileMutation.mutate(profileData);
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profileData.firstName}
                              onChange={(e) =>
                                setProfileData(prev => ({
                                  ...prev,
                                  firstName: e.target.value,
                                }))
                              }
                              placeholder="Enter first name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profileData.lastName}
                              onChange={(e) =>
                                setProfileData(prev => ({
                                  ...prev,
                                  lastName: e.target.value,
                                }))
                              }
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData(prev => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData(prev => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditingProfile(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        {/* Contact Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Email</p>
                                <p className="text-sm text-gray-900">{dashboardData.user.email}</p>
                              </div>
                            </div>
                            {dashboardData.user.phone && (
                              <div className="flex items-center gap-3">
                                <div className="h-4 w-4 flex items-center justify-center text-gray-500">
                                  📞 
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Phone</p>
                                  <p className="text-sm text-gray-900">{dashboardData.user.phone}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Personal Information */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Personal Information</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">First Name</Label>
                              <p className="text-sm text-gray-900">{dashboardData.user.firstName}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Last Name</Label>
                              <p className="text-sm text-gray-900">{dashboardData.user.lastName}</p>
                            </div>
                          </div>
                        </div>

                        {/* Account Status */}
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Account Status</Label>
                          <p className="text-sm text-gray-900 mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Security Settings Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Change your password and manage account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        changePasswordMutation.mutate(passwordData);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData(prev => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData(prev => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData(prev => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          placeholder="Confirm new password"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                        className="w-full"
                      >
                        {changePasswordMutation.isPending ? 'Changing Password...' : 'Change Password'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>
                    Actions that cannot be undone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
                      <p className="text-xs text-red-600">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                          toast({
                            title: "Account Deletion",
                            description: "Please contact support to delete your account.",
                            variant: "default",
                          });
                        }
                      }}
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          )}
        </section>
      </div>

      {/* Modals */}
      <ProjectBookingModal
        isOpen={isProjectBookingModalOpen}
        onClose={() => setIsProjectBookingModalOpen(false)}
        user={dashboardData.user}
      />

      <ServiceCheckout
        isOpen={isServiceCheckoutOpen}
        onClose={() => setIsServiceCheckoutOpen(false)}
        user={dashboardData.user}
      />
    </div>
  );
}

// Sub-components for better organization

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

const StatCard = ({ icon, title, value }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-opacity-10 bg-current rounded-lg">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl font-bold text-gray-900">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface ProjectCardProps {
  project: Project;
  onViewDetails: () => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  formatDate: (dateString: string) => string;
  truncateText: (text: string, maxLength: number) => string;
}

const ProjectCard = ({
  project,
  onViewDetails,
  getStatusColor,
  getPriorityColor,
  formatDate,
  truncateText,
}: ProjectCardProps) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="default"
              className="text-xs"
            >
              {project.priority} priority
            </Badge>
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}
              />
              <span className="text-xs text-muted-foreground capitalize">
                {project.status.replace("-", " ")}
              </span>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">#{project.id}</div>
      </div>
      <CardDescription className="line-clamp-2">
        {truncateText(project.description, MAX_PROJECT_DESCRIPTION_LENGTH)}
      </CardDescription>
    </CardHeader>

    <CardContent className="pt-0">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progress</span>
            <span className="text-blue-600 font-semibold">
              {project.progress}%
            </span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-muted-foreground truncate">
              {project.assignedTo}
            </span>
          </div>

          {project.budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-muted-foreground">
                {project.budget}
              </span>
            </div>
          )}
        </div>

        {project.dueDate && (
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-muted-foreground">
              Due: {formatDate(project.dueDate)}
            </span>
          </div>
        )}

        <Button variant="default" className="w-full" onClick={onViewDetails}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </div>
    </CardContent>
  </Card>
);

interface BookingCardProps {
  booking: Booking;
  formatDate: (dateString: string) => string;
}

const BookingCard = ({ booking, formatDate }: BookingCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <h4 className="font-semibold">{booking.service}</h4>
          <p className="text-sm text-gray-600">{booking.projectType}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Budget</p>
          <p className="font-medium">{booking.budget}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Timeline</p>
          <p className="font-medium">{booking.timeline}</p>
        </div>

        <div>
          <Badge
            variant={
              booking.paymentStatus === "completed" ? "default" : "secondary"
            }
          >
            {booking.paymentStatus}
          </Badge>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(booking.createdAt)}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface PaymentCardProps {
  payment: PaymentLog;
  formatCurrency: (amount: string | number) => string;
  formatDate: (dateString: string) => string;
}

const PaymentCard = ({
  payment,
  formatCurrency,
  formatDate,
}: PaymentCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CreditCard className="h-8 w-8 text-green-600" />
          <div>
            <h4 className="font-semibold">{payment.serviceName}</h4>
            <p className="text-sm text-gray-600">
              Reference: {payment.reference}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(payment.amount)}
          </p>
          <Badge
            variant={payment.status === "completed" ? "default" : "secondary"}
          >
            {payment.status}
          </Badge>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(payment.paidAt || payment.createdAt)}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface MessageCardProps {
  message: Message;
  formatDate: (dateString: string) => string;
}

const MessageCard = ({ message, formatDate }: MessageCardProps) => (
  <Card className={!message.isRead ? "border-blue-500 bg-blue-50" : ""}>
    <CardContent className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold">{message.subject}</h4>
            {!message.isRead && (
              <Badge variant="default" className="text-xs">
                New
              </Badge>
            )}
          </div>

          <p className="text-gray-700 mb-2">{message.message}</p>

          <p className="text-sm text-gray-500">
            From: {message.senderType === "admin" ? "Project Team" : "You"} •
            {formatDate(message.createdAt)}
          </p>
        </div>

        <MessageSquare className="h-5 w-5 text-gray-400 flex-shrink-0" />
      </div>
    </CardContent>
  </Card>
);

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-16">
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action}
    </CardContent>
  </Card>
);
