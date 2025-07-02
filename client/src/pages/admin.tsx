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
  CheckCircle, AlertCircle, Timer, Briefcase, Download
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
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
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

  useEffect(() => {
    let filtered = payments;

    if (paymentSearchTerm) {
      filtered = filtered.filter(payment =>
        payment.customerEmail?.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
        payment.serviceName?.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
        payment.reference?.toLowerCase().includes(paymentSearchTerm.toLowerCase())
      );
    }

    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === paymentStatusFilter);
    }

    setFilteredPayments(filtered);
  }, [payments, paymentSearchTerm, paymentStatusFilter]);

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
        toast({
          title: "Success",
          description: "Settings saved successfully!",
        });
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
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in-progress': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'planning': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'testing': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'on-hold': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = "blue", trend }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color?: string;
    trend?: { value: string; positive: boolean }
  }) => (
    <Card className="group hover:shadow-md transition-all duration-200 border-0 bg-white/60 backdrop-blur-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-center gap-3">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
              {trend && (
                <Badge variant="secondary" className={`text-xs ${
                  trend.positive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {trend.value}
                </Badge>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-100 to-${color}-200 group-hover:scale-110 transition-transform duration-200`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
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
          adminId: 1
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Message sent successfully",
        });
        setMessageData({ subject: '', message: '' });
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500">Welcome back, {adminProfile.username}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-700">{adminProfile.username}</span>
          </div>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetHeader className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <div className="p-6">
                <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                  <Shield className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 lg:py-8 max-w-7xl">
        {/* Desktop Header */}
        <div className="hidden lg:flex mb-8 justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 text-lg">Welcome back, {adminProfile.username}! Here's your business overview.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">{adminProfile.username}</p>
                <p className="text-xs text-gray-500 capitalize">{adminProfile.role}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="bg-white/60 backdrop-blur-sm border-gray-200/50 hover:bg-white">
              <Shield className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          {/* Modern Tab Navigation */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto bg-transparent gap-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2.5 px-3 text-xs lg:text-sm font-medium transition-all duration-200">
                <BarChart3 className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2.5 px-3 text-xs lg:text-sm font-medium transition-all duration-200">
                <Calendar className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2.5 px-3 text-xs lg:text-sm font-medium transition-all duration-200">
                <Briefcase className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2.5 px-3 text-xs lg:text-sm font-medium transition-all duration-200">
                <DollarSign className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2.5 px-3 text-xs lg:text-sm font-medium transition-all duration-200">
                <Users className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Team</span>
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2.5 px-3 text-xs lg:text-sm font-medium transition-all duration-200">
                <MessageSquare className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Inquiries</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2.5 px-3 text-xs lg:text-sm font-medium transition-all duration-200">
                <User className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2.5 px-3 text-xs lg:text-sm font-medium transition-all duration-200">
                <Settings className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Settings</span>
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
                color="emerald"
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2 border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between py-3 px-4 bg-white/50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{booking.name}</p>
                          <p className="text-xs text-gray-500">{booking.service}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(booking.paymentStatus)} border`}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Status Overview */}
              <Card className="border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    Project Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { status: 'completed', count: projects.filter(p => p.status === 'completed').length, color: 'bg-emerald-500', label: 'Completed' },
                    { status: 'in-progress', count: projects.filter(p => p.status === 'in-progress').length, color: 'bg-blue-500', label: 'In Progress' },
                    { status: 'planning', count: projects.filter(p => p.status === 'planning').length, color: 'bg-purple-500', label: 'Planning' },
                    { status: 'on-hold', count: projects.filter(p => p.status === 'on-hold').length, color: 'bg-amber-500', label: 'On Hold' }
                  ].map((item) => (
                    <div key={item.status} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Bookings" value={bookings.length} icon={Calendar} color="blue" />
              <StatCard title="Pending Payment" value={bookings.filter(b => b.paymentStatus === 'pending').length} icon={Clock} color="amber" />
              <StatCard title="Paid Bookings" value={bookings.filter(b => b.paymentStatus === 'completed').length} icon={CheckCircle} color="emerald" />
              <StatCard title="This Month" value={bookings.filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth()).length} icon={TrendingUp} color="purple" />
            </div>

            {/* Modern Search Filters */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search bookings..."
                      value={bookingSearchTerm}
                      onChange={(e) => setBookingSearchTerm(e.target.value)}
                      className="pl-10 bg-white/50 border-gray-200/50"
                    />
                  </div>
                  <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                    <SelectTrigger className="w-full lg:w-48 bg-white/50 border-gray-200/50">
                      <SelectValue placeholder="Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Modern Bookings List */}
            <div className="grid gap-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{booking.name}</h3>
                            <Badge className={`${getStatusColor(booking.paymentStatus)} border mt-1`}>
                              {booking.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{booking.email}</span>
                          </div>
                          {booking.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{booking.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            <span>{booking.service}</span>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50/50 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">
                            {booking.service} • {booking.projectType}
                          </p>
                          {booking.budget && (
                            <p className="text-sm text-gray-600 mt-1">Budget: {booking.budget}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[120px]">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedBooking(booking); setIsViewModalOpen(true); }} className="flex-1 lg:flex-none">
                          <Eye className="w-4 h-4 lg:mr-2" />
                          <span className="hidden lg:inline">View</span>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedBooking(booking); setEditFormData(booking); setIsEditModalOpen(true); }} className="flex-1 lg:flex-none">
                          <Edit className="w-4 h-4 lg:mr-2" />
                          <span className="hidden lg:inline">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="flex-1 lg:flex-none">
                              <Trash2 className="w-4 h-4 lg:mr-2" />
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
              {filteredBookings.length === 0 && (
                <Card className="border-0 bg-white/60 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-500">Bookings will appear here once clients start booking consultations.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                <StatCard title="Total Projects" value={projects.length} icon={Target} color="blue" />
                <StatCard title="In Progress" value={projects.filter(p => p.status === 'in-progress').length} icon={Timer} color="blue" />
                <StatCard title="Completed" value={projects.filter(p => p.status === 'completed').length} icon={CheckCircle} color="emerald" />
                <StatCard title="Planning" value={projects.filter(p => p.status === 'planning').length} icon={FileText} color="purple" />
              </div>
              <Button onClick={() => setIsProjectModalOpen(true)} className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            {/* Modern Projects Grid */}
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 text-gray-900">{project.name}</h3>
                          <Badge className={`${getStatusColor(project.status)} border`}>
                            {project.status}
                          </Badge>
                        </div>
                        <Badge variant={project.priority === 'high' ? 'destructive' : project.priority === 'medium' ? 'default' : 'secondary'} className="ml-2">
                          {project.priority}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{project.clientEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>{project.budget || 'Not set'}</span>
                        </div>
                        {project.dueDate && (
                          <div className="flex items-center gap-2 text-gray-600">
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
              {filteredProjects.length === 0 && (
                <div className="lg:col-span-2 xl:col-span-3">
                  <Card className="border-0 bg-white/60 backdrop-blur-sm">
                    <CardContent className="text-center py-12">
                      <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                      <p className="text-gray-500 mb-4">Create your first project to get started.</p>
                      <Button onClick={() => setIsProjectModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Project
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Payments" value={payments.length} icon={DollarSign} color="emerald" />
              <StatCard title="Total Revenue" value={`₦${payments.reduce((sum, p) => sum + Number(p.amount || 0), 0).toLocaleString()}`} icon={TrendingUp} color="emerald" />
              <StatCard title="This Month" value={payments.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length} icon={Calendar} color="blue" />
              <StatCard title="Avg Payment" value={`₦${payments.length > 0 ? Math.round(payments.reduce((sum, p) => sum + Number(p.amount || 0), 0) / payments.length).toLocaleString() : '0'}`} icon={DollarSign} color="purple" />
            </div>

            {/* Payment Filters */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search payments by email, service, or reference..."
                      value={paymentSearchTerm}
                      onChange={(e) => setPaymentSearchTerm(e.target.value)}
                      className="pl-10 bg-white/50 border-gray-200/50"
                    />
                  </div>
                  <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                    <SelectTrigger className="w-full lg:w-48 bg-white/50 border-gray-200/50">
                      <SelectValue placeholder="Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="success">Successful</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Payments List */}
            <div className="grid gap-4">
              {filteredPayments.map((payment) => (
                <Card key={payment.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-xl text-gray-900">₦{Number(payment.amount).toLocaleString()}</h3>
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border mt-1">
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{payment.customerEmail}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>{payment.serviceName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Paid: {new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>Ref: {payment.reference}</span>
                          </div>
                        </div>

                        {payment.metadata && (
                          <div className="mt-4 p-3 bg-gray-50/50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Details</h4>
                            <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
                              {payment.metadata.booking_id && (
                                <div>Booking ID: {payment.metadata.booking_id}</div>
                              )}
                              {payment.metadata.service_id && (
                                <div>Service Type: {payment.metadata.service_id}</div>
                              )}
                              {payment.metadata.customer_name && (
                                <div>Customer: {payment.metadata.customer_name}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 lg:min-w-[120px]">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            const receiptData = `Payment Receipt\n================\nAmount: ₦${Number(payment.amount).toLocaleString()}\nCustomer: ${payment.customerEmail}\nService: ${payment.serviceName}\nReference: ${payment.reference}\nDate: ${new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}\nStatus: ${payment.status}\n\nThank you for your business!\nChidi Ogara - Senior Fullstack Developer`;
                            const blob = new Blob([receiptData], { type: 'text/plain' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `receipt-${payment.reference}.txt`;
                            a.click();
                            window.URL.revokeObjectURL(url);
                          }}
                          className="text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Receipt
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(payment.reference);
                            toast({ title: "Copied!", description: "Payment reference copied to clipboard" });
                          }}
                          className="text-xs"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Copy Ref
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredPayments.length === 0 && (
                <Card className="border-0 bg-white/60 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                    <p className="text-gray-500">Payment records will appear here once transactions are processed.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                <StatCard title="Team Members" value={teamMembers.length} icon={Users} color="blue" />
                <StatCard title="Active" value={teamMembers.filter(m => m.isActive).length} icon={CheckCircle} color="emerald" />
                <StatCard title="Admins" value={teamMembers.filter(m => m.role === 'admin').length} icon={Shield} color="purple" />
              </div>
              <Button onClick={() => setIsTeamModalOpen(true)} className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>

            {/* Team Members Grid */}
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {teamMembers.map((member) => (
                <Card key={member.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{member.username}</h3>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <Badge className={member.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Role:</span>
                          <Badge variant="outline" className="capitalize">{member.role}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Joined:</span>
                          <span className="text-gray-900">{new Date(member.createdAt).toLocaleDateString()}</span>
                        </div>
                        {member.lastLogin && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Login:</span>
                            <span className="text-gray-900">{new Date(member.lastLogin).toLocaleDateString()}</span>
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
              {teamMembers.length === 0 && (
                <div className="lg:col-span-2 xl:col-span-3">
                  <Card className="border-0 bg-white/60 backdrop-blur-sm">
                    <CardContent className="text-center py-12">
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                      <p className="text-gray-500 mb-4">Add team members to collaborate on projects.</p>
                      <Button onClick={() => setIsTeamModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add First Member
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Inquiries" value={inquiries.length} icon={MessageSquare} color="blue" />
              <StatCard title="New" value={inquiries.filter(i => i.status === 'new').length} icon={Bell} color="blue" />
              <StatCard title="In Progress" value={inquiries.filter(i => i.status === 'in-progress').length} icon={Clock} color="amber" />
              <StatCard title="Completed" value={inquiries.filter(i => i.status === 'completed').length} icon={CheckCircle} color="emerald" />
            </div>

            {/* Filters */}
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search inquiries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/50 border-gray-200/50"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full lg:w-48 bg-white/50 border-gray-200/50">
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
            <div className="grid gap-4">
              {filteredInquiries.map((inquiry) => (
                <Card key={inquiry.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{inquiry.name}</h3>
                            <Badge className={`${getStatusColor(inquiry.status)} border mt-1`}>
                              {inquiry.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{inquiry.email}</span>
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{inquiry.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            <span>{inquiry.service}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700 line-clamp-2">{inquiry.message}</p>
                        </div>
                      </div>
                      <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[120px]">
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
              {filteredInquiries.length === 0 && (
                <Card className="border-0 bg-white/60 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
                    <p className="text-gray-500">Customer inquiries will appear here when they contact you.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
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
                      className="bg-white/50 border-gray-200/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={adminProfile.email}
                      onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                      className="bg-white/50 border-gray-200/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-role">Role</Label>
                    <Input
                      id="admin-role"
                      value={adminProfile.role}
                      disabled
                      className="bg-gray-100/50 border-gray-200/50"
                    />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
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
                      className="bg-white/50 border-gray-200/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="bg-white/50 border-gray-200/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="bg-white/50 border-gray-200/50"
                    />
                  </div>
                  <Button 
                    onClick={handlePasswordChange}
                    disabled={isChangingPassword}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
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
                    className="bg-white/50 border-gray-200/50"
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={siteSettings.seoDescription}
                    onChange={(e) => setSiteSettings({...siteSettings, seoDescription: e.target.value})}
                    rows={3}
                    className="bg-white/50 border-gray-200/50"
                  />
                </div>
                <div>
                  <Label htmlFor="seoKeywords">Keywords</Label>
                  <Input
                    id="seoKeywords"
                    value={siteSettings.seoKeywords}
                    onChange={(e) => setSiteSettings({...siteSettings, seoKeywords: e.target.value})}
                    className="bg-white/50 border-gray-200/50"
                  />
                </div>
                <Button onClick={saveSiteSettings} className="w-full bg-blue-600 hover:bg-blue-700">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals remain the same - keeping existing modal code for Edit Booking, View Booking, Project, and Team Member modals */}

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
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
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