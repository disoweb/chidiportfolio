
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
  Settings,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface DashboardData {
  user: User;
  projects: Project[];
  bookings: Booking[];
  paymentLogs: PaymentLog[];
  unreadMessages: Message[];
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalSpent: number;
  };
}

export default function ClientDashboard() {
  const [sessionToken, setSessionToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '', 
    phone: '' 
  });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [projectTrackingId, setProjectTrackingId] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check for existing session on load
  useEffect(() => {
    const token = localStorage.getItem('clientSessionToken');
    if (token) {
      setSessionToken(token);
      verifySession(token);
    }
  }, []);

  const verifySession = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setSessionToken(token);
      } else {
        localStorage.removeItem('clientSessionToken');
        setIsAuthenticated(false);
      }
    } catch (error) {
      localStorage.removeItem('clientSessionToken');
      setIsAuthenticated(false);
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('clientSessionToken', data.sessionToken);
      setSessionToken(data.sessionToken);
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.firstName}!`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('clientSessionToken', data.sessionToken);
      setSessionToken(data.sessionToken);
      setIsAuthenticated(true);
      toast({
        title: "Registration Successful",
        description: `Welcome, ${data.user.firstName}!`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard', sessionToken],
    queryFn: async () => {
      const response = await fetch(`/api/user/dashboard/${sessionToken}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    },
    enabled: !!sessionToken && isAuthenticated,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const trackProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/track-project/${projectId}`);
      if (!response.ok) throw new Error('Project not found');
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedProject(data.project);
      toast({
        title: "Project Found",
        description: `Tracking project: ${data.project.name}`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Project Not Found",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken })
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('clientSessionToken');
      setSessionToken('');
      setIsAuthenticated(false);
      setLoginData({ email: '', password: '' });
      setRegisterData({ email: '', password: '', firstName: '', lastName: '', phone: '' });
      queryClient.clear();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'testing': return 'bg-yellow-500';
      case 'planning': return 'bg-purple-500';
      case 'on-hold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isLoginMode ? 'Client Login' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {isLoginMode ? 'Access your project dashboard' : 'Sign up to track your projects'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoginMode ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <Button 
                  className="w-full"
                  onClick={() => loginMutation.mutate(loginData)}
                  disabled={loginMutation.isPending || !loginData.email || !loginData.password}
                >
                  {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    placeholder="+1234567890"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <Button 
                  className="w-full"
                  onClick={() => registerMutation.mutate(registerData)}
                  disabled={registerMutation.isPending || !registerData.email || !registerData.password || !registerData.firstName}
                >
                  {registerMutation.isPending ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </div>
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
                  disabled={!projectTrackingId || trackProjectMutation.isPending}
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
              {isLoginMode ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="text-center p-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-4">Failed to load your dashboard data.</p>
            <Button onClick={logout}>Logout and Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {dashboardData.user.firstName}!</h1>
                <p className="text-gray-600">Here's an overview of your projects and activities.</p>
              </div>
              <div className="flex items-center gap-4">
                {dashboardData.unreadMessages.length > 0 && (
                  <div className="relative">
                    <Bell className="h-6 w-6 text-gray-500" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {dashboardData.unreadMessages.length}
                    </span>
                  </div>
                )}
                <Button variant="outline" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="h-4 w-4" />
              {dashboardData.user.email}
              {dashboardData.user.phone && (
                <>
                  <span>•</span>
                  {dashboardData.user.phone}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.activeProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.completedProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₦{dashboardData.stats.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dashboardData.projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getPriorityColor(project.priority)} className="text-xs">
                            {project.priority} priority
                          </Badge>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                            <span className="text-xs text-muted-foreground capitalize">{project.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">#{project.id}</div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Progress</span>
                          <span className="text-blue-600 font-semibold">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-muted-foreground truncate">{project.assignedTo}</span>
                        </div>
                        {project.budget && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-muted-foreground">{project.budget}</span>
                          </div>
                        )}
                      </div>

                      {project.dueDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-muted-foreground">
                            Due: {new Date(project.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {dashboardData.projects.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Briefcase className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                  <p className="text-gray-600 text-center mb-6">
                    You don't have any projects yet. Book a service to get started!
                  </p>
                  <Button onClick={() => window.location.href = '/#booking'}>
                    Book a New Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <div className="grid gap-4">
              {dashboardData.bookings.map((booking) => (
                <Card key={booking.id}>
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
                        <Badge variant={booking.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                          {booking.paymentStatus}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="grid gap-4">
              {dashboardData.paymentLogs.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-semibold">{payment.serviceName}</h4>
                          <p className="text-sm text-gray-600">Reference: {payment.reference}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">₦{parseFloat(payment.amount).toLocaleString()}</p>
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {dashboardData.paymentLogs.length === 0 && (
              <Card>
                <CardContent className="text-center py-16">
                  <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Payment History</h3>
                  <p className="text-gray-600">Your payment transactions will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <div className="grid gap-4">
              {dashboardData.unreadMessages.map((message) => (
                <Card key={message.id} className={`${!message.isRead ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{message.subject}</h4>
                          {!message.isRead && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{message.message}</p>
                        <p className="text-sm text-gray-500">
                          From: {message.senderType === 'admin' ? 'Project Team' : 'You'} • 
                          {new Date(message.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {dashboardData.unreadMessages.length === 0 && (
              <Card>
                <CardContent className="text-center py-16">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Messages</h3>
                  <p className="text-gray-600">Messages from your project team will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
