import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Mail, Phone, Calendar, Settings, Globe, Search, Shield, Edit, Trash2, Eye, Plus, 
  DollarSign, Clock, User, Target, Users, Building2, MessageSquare, Bell, 
  UserPlus, FileText, Activity, TrendingUp, Menu, X, BarChart3, PieChart,
  CheckCircle, AlertCircle, Timer, Briefcase
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from "@/components/ui/use-toast"

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  status: 'new' | 'in-progress' | 'completed';
  createdAt: string;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  phone?: string;
  service: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  message?: string;
  paymentStatus: string;
  transactionId?: number;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: number;
  bookingId?: number;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  startDate?: string;
  dueDate?: string;
  clientEmail: string;
  budget?: string;
  assignedTo: string;
  createdAt: string;
}

interface TeamMember {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface SiteSettings {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;
  siteName: string;
  contactEmail: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
  };
}

interface Message {
  id: number;
  subject: string;
  message: string;
  recipientEmail: string;
  projectName: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingSearchTerm, setBookingSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Booking>>({});
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({});
  const [teamFormData, setTeamFormData] = useState({ username: '', email: '', password: '', role: 'team_member' });
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    seoTitle: 'Chidi Ogara - Senior Fullstack Developer',
    seoDescription: 'Professional fullstack web developer specializing in React, Node.js, and modern web technologies.',
    seoKeywords: 'fullstack developer, web development, React, Node.js, TypeScript, JavaScript',
    ogImage: '/og-image.jpg',
    siteName: 'Chidi Ogara Portfolio',
    contactEmail: 'chidi@example.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/chidiogara',
      github: 'https://github.com/chidiogara',
      twitter: 'https://twitter.com/chidiogara'
    }
  });
  const [adminProfile, setAdminProfile] = useState({
    username: '',
    email: '',
    role: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messageData, setMessageData] = useState({ subject: '', message: '' });
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLocation('/admin/login');
      return;
    }
    setIsAuthenticated(true);

    fetchInquiries();
    fetchBookings();
    fetchProjects();
    fetchPayments();
    fetchSiteSettings();
    fetchAdminProfile();
    fetchTeamMembers();
    fetchRecentMessages();
  }, [setLocation]);

  useEffect(() => {
    let filtered = inquiries;

    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter);
    }

    setFilteredInquiries(filtered);
  }, [inquiries, searchTerm, statusFilter]);

  useEffect(() => {
    let filtered = bookings;

    if (bookingSearchTerm) {
      filtered = filtered.filter(booking =>
        booking.name.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
        booking.service.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
        booking.projectType.toLowerCase().includes(bookingSearchTerm.toLowerCase())
      );
    }

    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.paymentStatus === paymentStatusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, bookingSearchTerm, paymentStatusFilter]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/admin/inquiries');
      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
      setFilteredProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
      setFilteredProjects([]);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payment-logs');
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
      setFilteredPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      setPayments([]);
      setFilteredPayments([]);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setSiteSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
      if (adminUser.id) {
        const response = await fetch(`/api/admin/users/${adminUser.id}`);
        const data = await response.json();
        setAdminProfile({
          username: data.username || '',
          email: data.email || '',
          role: data.role || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch admin profile:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setTeamMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setTeamMembers([]);
    }
  };

  const updateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setInquiries(inquiries.map(inquiry =>
          inquiry.id === id ? { ...inquiry, status } : inquiry
        ));
      }
    } catch (error) {
      console.error('Failed to update inquiry:', error);
    }
  };

  const updateBooking = async (id: number, updateData: Partial<Booking>) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const result = await response.json();
        setBookings(bookings.map(booking =>
          booking.id === id ? result.booking : booking
        ));
        setIsEditModalOpen(false);
        setEditFormData({});
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const deleteBooking = async (id: number) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setBookings(bookings.filter(booking => booking.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const createProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectFormData)
      });

      if (response.ok) {
        const result = await response.json();
        setProjects([...projects, result.project]);
        setIsProjectModalOpen(false);
        setProjectFormData({});
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const updateProject = async (id: number, updateData: Partial<Project>) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const result = await response.json();
        setProjects(projects.map(project =>
          project.id === id ? result.project : project
        ));
        setIsProjectModalOpen(false);
        setSelectedProject(null);
        setProjectFormData({});
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const createTeamMember = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamFormData)
      });

      if (response.ok) {
        const result = await response.json();
        setTeamMembers([...teamMembers, result.user]);
        setIsTeamModalOpen(false);
        setTeamFormData({ username: '', email: '', password: '', role: 'team_member' });
      }
    } catch (error) {
      console.error('Failed to create team member:', error);
    }
  };

  const deleteTeamMember = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTeamMembers(teamMembers.filter(member => member.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };

  const saveSiteSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings)
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setLocation('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'planning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'testing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'on-hold': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = "blue", trend }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color?: string;
    trend?: { value: string; positive: boolean }
  }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center space-x-2">
              <p className={`text-2xl sm:text-3xl font-bold text-${color}-600`}>{value}</p>
              {trend && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  trend.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {trend.value}
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 bg-${color}-100 rounded-full`}>
            <Icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch(`/api/admin/users/${adminProfile.id}/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedProject || !messageData.subject || !messageData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject.id,
          clientEmail: selectedProject.clientEmail,
          subject: messageData.subject,
          message: messageData.message,
          adminId: 1 // Current admin ID
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Message sent successfully",
        });
        setMessageData({ subject: '', message: '' });
        // Refresh recent messages
        fetchRecentMessages();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const fetchRecentMessages = async () => {
    try {
      const response = await fetch('/api/admin/recent-messages');
      if (response.ok) {
        const messages = await response.json();
        setRecentMessages(messages);
      }
    } catch (error) {
      console.error('Failed to fetch recent messages:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-xs text-gray-600">Welcome back, {adminProfile.username}</p>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <SheetHeader className="p-6 border-b">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-8 h-8 p-1.5 bg-blue-100 text-blue-600 rounded-full" />
                  <div>
                    <p className="font-medium text-sm">{adminProfile.username}</p>
                    <p className="text-xs text-gray-600">{adminProfile.role}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                  <Shield className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="container mx-auto px-4 py-4 lg:py-8 max-w-7xl">
        {/* Desktop Header */}
        <div className="hidden lg:flex mb-8 justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 text-lg">Welcome back, {adminProfile.username}! Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 bg-white rounded-lg border">
              <User className="w-8 h-8 p-1.5 bg-blue-100 text-blue-600 rounded-full" />
              <div>
                <p className="font-medium text-sm">{adminProfile.username}</p>
                <p className="text-xs text-gray-600">{adminProfile.role}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto bg-white shadow-sm">
              <TabsTrigger value="overview" className="text-xs lg:text-sm py-3">
                <BarChart3 className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="text-xs lg:text-sm py-3">
                <Calendar className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs lg:text-sm py-3">
                <Briefcase className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="text-xs lg:text-sm py-3">
                <DollarSign className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="text-xs lg:text-sm py-3">
                <Users className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Team</span>
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="text-xs lg:text-sm py-3">
                <MessageSquare className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Inquiries</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-xs lg:text-sm py-3">
                <User className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs lg:text-sm py-3">
                <Settings className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="messaging" className="text-xs lg:text-sm py-3">
                <MessageSquare className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatCard 
                title="Total Bookings" 
                value={bookings.length} 
                icon={Calendar} 
                color="blue"
                trend={{ value: "+12%", positive: true }}
              />
              <StatCard 
                title="Active Projects" 
                value={projects.filter(p => p.status === 'in-progress').length} 
                icon={Target} 
                color="green"
                trend={{ value: "+5%", positive: true }}
              />
              <StatCard 
                title="Team Members" 
                value={teamMembers.length} 
                icon={Users} 
                color="purple"
              />
              <StatCard 
                title="Total Revenue" 
                value={`₦${payments.reduce((sum, p) => sum + Number(p.amount || 0), 0).toLocaleString()}`} 
                icon={DollarSign} 
                color="emerald"
                trend={{ value: "+23%", positive: true }}
              />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{booking.name}</p>
                            <p className="text-xs text-muted-foreground">{booking.service}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.paymentStatus)}>
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Project Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Project Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { status: 'completed', count: projects.filter(p => p.status === 'completed').length, color: 'bg-green-500' },
                      { status: 'in-progress', count: projects.filter(p => p.status === 'in-progress').length, color: 'bg-blue-500' },
                      { status: 'planning', count: projects.filter(p => p.status === 'planning').length, color: 'bg-purple-500' },
                      { status: 'on-hold', count: projects.filter(p => p.status === 'on-hold').length, color: 'bg-red-500' }
                    ].map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm capitalize">{item.status}</span>
                        </div>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Bookings" value={bookings.length} icon={Calendar} />
              <StatCard title="Pending Payment" value={bookings.filter(b => b.paymentStatus === 'pending').length} icon={Clock} color="orange" />
              <StatCard title="Paid Bookings" value={bookings.filter(b => b.paymentStatus === 'completed').length} icon={CheckCircle} color="green" />
              <StatCard title="This Month" value={bookings.filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth()).length} icon={TrendingUp} color="purple" />
            </div>

            {/* Filters */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search bookings..."
                      value={bookingSearchTerm}
                      onChange={(e) => setBookingSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      ```text
<SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{booking.name}</h3>
                            <Badge className={getStatusColor(booking.paymentStatus)}>
                              {booking.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{booking.email}</span>
                          </div>
                          {booking.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{booking.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{booking.service}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium">
                            {booking.service} | {booking.projectType}
                          </p>
                          {booking.budget && (
                            <p className="text-sm text-muted-foreground">Budget: {booking.budget}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row lg:flex-col gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedBooking(booking); setIsViewModalOpen(true); }}>
                          <Eye className="w-4 h-4 lg:mr-1" />
                          <span className="hidden lg:inline">View</span>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedBooking(booking); setEditFormData(booking); setIsEditModalOpen(true); }}>
                          <Edit className="w-4 h-4 lg:mr-1" />
                          <span className="hidden lg:inline">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4 lg:mr-1" />
                              <span className="hidden lg:inline">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the booking for {booking.name}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteBooking(booking.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                <StatCard title="Total Projects" value={projects.length} icon={Target} />
                <StatCard title="In Progress" value={projects.filter(p => p.status === 'in-progress').length} icon={Timer} color="blue" />
                <StatCard title="Completed" value={projects.filter(p => p.status === 'completed').length} icon={CheckCircle} color="green" />
                <StatCard title="Planning" value={projects.filter(p => p.status === 'planning').length} icon={FileText} color="purple" />
              </div>
              <Button onClick={() => setIsProjectModalOpen(true)} className="w-full lg:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 lg:p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <Badge variant={project.priority === 'high' ? 'destructive' : project.priority === 'medium' ? 'default' : 'secondary'}>
                          {project.priority}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{project.clientEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>{project.budget || 'Not set'}</span>
                        </div>
                        {project.dueDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => { 
                            setSelectedProject(project); 
                            setProjectFormData(project); 
                            setIsProjectModalOpen(true); 
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                <StatCard title="Team Members" value={teamMembers.length} icon={Users} />
                <StatCard title="Active" value={teamMembers.filter(m => m.isActive).length} icon={CheckCircle} color="green" />
                <StatCard title="Admins" value={teamMembers.filter(m => m.role === 'admin').length} icon={Shield} color="purple" />
              </div>
              <Button onClick={() => setIsTeamModalOpen(true)} className="w-full lg:w-auto">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>

            {/* Team Members Grid */}
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {teamMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 lg:p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{member.username}</h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <Badge className={member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Role:</span>
                          <span className="font-medium capitalize">{member.role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Joined:</span>
                          <span>{new Date(member.createdAt).toLocaleDateString()}</span>
                        </div>
                        {member.lastLogin && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Login:</span>
                            <span>{new Date(member.lastLogin).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="flex-1">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {member.username} from the team? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteTeamMember(member.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messaging" className="space-y-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Send Message to Client</CardTitle>
                      <CardDescription>Send updates and messages to your clients</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="project-select">Select Project</Label>
                        <Select onValueChange={(value) => {
                          const project = projects.find(p => p.id.toString() === value);
                          setSelectedProject(project || null);
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a project" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={project.id.toString()}>
                                {project.name} - {project.clientEmail}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedProject && (
                        <>
                          <div>
                            <Label htmlFor="message-subject">Subject</Label>
                            <Input
                              id="message-subject"
                              placeholder="Message subject"
                              value={messageData.subject}
                              onChange={(e) => setMessageData(prev => ({ ...prev, subject: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="message-content">Message</Label>
                            <Textarea
                              id="message-content"
                              placeholder="Your message to the client..."
                              rows={4}
                              value={messageData.message}
                              onChange={(e) => setMessageData(prev => ({ ...prev, message: e.target.value }))}
                            />
                          </div>

                          <Button 
                            onClick={handleSendMessage}
                            disabled={!messageData.subject || !messageData.message}
                            className="w-full"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentMessages.length === 0 ? (
                          <p className="text-center text-gray-500 py-8">No messages sent yet</p>
                        ) : (
                          recentMessages.map((message) => (
                            <div key={message.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{message.subject}</h4>
                                <span className="text-sm text-gray-500">
                                  {new Date(message.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-2">{message.message}</p>
                              <p className="text-sm text-gray-500">
                                To: {message.recipientEmail} (Project: {message.projectName})
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Payments" value={payments.length} icon={DollarSign} color="green" />
              <StatCard title="Total Revenue" value={`₦${payments.reduce((sum, p) => sum + Number(p.amount || 0), 0).toLocaleString()}`} icon={TrendingUp} color="green" />
              <StatCard title="This Month" value={payments.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length} icon={Calendar} color="blue" />
              <StatCard title="Avg Payment" value={`₦${payments.length > 0 ? Math.round(payments.reduce((sum, p) => sum + Number(p.amount || 0), 0) / payments.length).toLocaleString() : '0'}`} icon={DollarSign} color="purple" />
            </div>

            {/* Payments List */}
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <Card key={payment.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">₦{Number(payment.amount).toLocaleString()}</h3>
                            <Badge className="bg-green-100 text-green-800">
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{payment.customerEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>{payment.serviceName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Paid: {new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>Ref: {payment.reference}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Inquiries" value={inquiries.length} icon={MessageSquare} />
              <StatCard title="New" value={inquiries.filter(i => i.status === 'new').length} icon={Bell} color="blue" />
              <StatCard title="In Progress" value={inquiries.filter(i => i.status === 'in-progress').length} icon={Clock} color="orange" />
              <StatCard title="Completed" value={inquiries.filter(i => i.status === 'completed').length} icon={CheckCircle} color="green" />
            </div>

            {/* Filters */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search inquiries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Inquiries List */}
            <div className="space-y-4">
              {filteredInquiries.map((inquiry) => (
                <Card key={inquiry.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{inquiry.name}</h3>
                            <Badge className={getStatusColor(inquiry.status)}>
                              {inquiry.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{inquiry.email}</span>
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{inquiry.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{inquiry.service}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700 line-clamp-2">{inquiry.message}</p>
                        </div>
                      </div>
                      <div className="flex flex-row lg:flex-col gap-2">
                        <Button
                          size="sm"
                          variant={inquiry.status === 'new' ? 'default' : 'outline'}
                          onClick={() => updateInquiryStatus(inquiry.id, 'new')}
                          className="flex-1 lg:flex-none text-xs"
                        >
                          New
                        </Button>
                        <Button
                          size="sm"
                          variant={inquiry.status === 'in-progress' ? 'default' : 'outline'}
                          onClick={() => updateInquiryStatus(inquiry.id, 'in-progress')}
                          className="flex-1 lg:flex-none text-xs"
                        >
                          Progress
                        </Button>
                        <Button
                          size="sm"
                          variant={inquiry.status === 'completed' ? 'default' : 'outline'}
                          onClick={() => updateInquiryStatus(inquiry.id, 'completed')}
                          className="flex-1 lg:flex-none text-xs"
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="admin-username">Username</Label>
                    <Input
                      id="admin-username"
                      value={adminProfile.username}
                      onChange={(e) => setAdminProfile({...adminProfile, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={adminProfile.email}
                      onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-role">Role</Label>
                    <Input
                      id="admin-role"
                      value={adminProfile.role}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <Button className="w-full">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    />
                  </div>
                  <Button 
                    disabled={isChangingPassword}
                    className="w-full"
                  >
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">Site Title</Label>
                  <Input
                    id="seoTitle"
                    value={siteSettings.seoTitle}
                    onChange={(e) => setSiteSettings({...siteSettings, seoTitle: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={siteSettings.seoDescription}
                    onChange={(e) => setSiteSettings({...siteSettings, seoDescription: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="seoKeywords">Keywords</Label>
                  <Input
                    id="seoKeywords"
                    value={siteSettings.seoKeywords}
                    onChange={(e) => setSiteSettings({...siteSettings, seoKeywords: e.target.value})}
                  />
                </div>
                <Button onClick={saveSiteSettings} className="w-full">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}

        {/* Edit Booking Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-service">Service</Label>
                  <Input
                    id="edit-service"
                    value={editFormData.service || ''}
                    onChange={(e) => setEditFormData({...editFormData, service: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-payment-status">Payment Status</Label>
                <Select
                  value={editFormData.paymentStatus || 'pending'}
                  onValueChange={(value) => setEditFormData({...editFormData, paymentStatus: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col lg:flex-row justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => selectedBooking && updateBooking(selectedBooking.id, editFormData)}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Booking Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                    <p className="text-sm">{selectedBooking.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-sm">{selectedBooking.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Service</Label>
                    <p className="text-sm">{selectedBooking.service}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Budget</Label>
                    <p className="text-sm">{selectedBooking.budget || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Message</Label>
                  <p className="text-sm">{selectedBooking.message || 'No message provided'}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Project Modal */}
        <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject ? 'Edit Project' : 'Create Project'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectFormData.name || ''}
                  onChange={(e) => setProjectFormData({...projectFormData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={projectFormData.description || ''}
                  onChange={(e) => setProjectFormData({...projectFormData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-status">Status</Label>
                  <Select
                    value={projectFormData.status || 'planning'}
                    onValueChange={(value) => setProjectFormData({...projectFormData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem><SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="project-priority">Priority</Label>
                  <Select
                    value={projectFormData.priority || 'medium'}
                    onValueChange={(value) => setProjectFormData({...projectFormData, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="project-client">Client Email</Label>
                <Input
                  id="project-client"
                  type="email"
                  value={projectFormData.clientEmail || ''}
                  onChange={(e) => setProjectFormData({...projectFormData, clientEmail: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-budget">Budget</Label>
                  <Input
                    id="project-budget"
                    value={projectFormData.budget || ''}
                    onChange={(e) => setProjectFormData({...projectFormData, budget: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="project-progress">Progress (%)</Label>
                  <Input
                    id="project-progress"
                    type="number"
                    min="0"
                    max="100"
                    value={projectFormData.progress || 0}
                    onChange={(e) => setProjectFormData({...projectFormData, progress: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row justify-end gap-2">
                <Button variant="outline" onClick={() => { 
                  setIsProjectModalOpen(false); 
                  setSelectedProject(null); 
                  setProjectFormData({}); 
                }}>
                  Cancel
                </Button>
                <Button onClick={() => selectedProject ? updateProject(selectedProject.id, projectFormData) : createProject()}>
                  {selectedProject ? 'Update' : 'Create'} Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Team Member Modal */}
        <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-username">Username</Label>
                <Input
                  id="team-username"
                  value={teamFormData.username}
                  onChange={(e) => setTeamFormData({...teamFormData, username: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="team-email">Email</Label>
                <Input
                  id="team-email"
                  type="email"
                  value={teamFormData.email}
                  onChange={(e) => setTeamFormData({...teamFormData, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="team-password">Password</Label>
                <Input
                  id="team-password"
                  type="password"
                  value={teamFormData.password}
                  onChange={(e) => setTeamFormData({...teamFormData, password: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="team-role">Role</Label>
                <Select
                  value={teamFormData.role}
                  onValueChange={(value) => setTeamFormData({...teamFormData, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="team_member">Team Member</SelectItem>
                    <SelectItem value="project_manager">Project Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col lg:flex-row justify-end gap-2">
                <Button variant="outline" onClick={() => { 
                  setIsTeamModalOpen(false); 
                  setTeamFormData({ username: '', email: '', password: '', role: 'team_member' }); 
                }}>
                  Cancel
                </Button>
                <Button onClick={createTeamMember}>
                  Add Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}