
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Mail, Phone, Calendar, Settings, Globe, Search, Shield, Edit, Trash2, Eye, Plus, DollarSign, Clock, User } from 'lucide-react';

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

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingSearchTerm, setBookingSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Booking>>({});
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    seoTitle: 'Chidi Ogara - Senior Fullstack Developer',
    seoDescription: 'Professional fullstack web developer specializing in React, Node.js, and modern web technologies. Building scalable solutions for businesses.',
    seoKeywords: 'fullstack developer, web development, React, Node.js, TypeScript, JavaScript, web applications',
    ogImage: '/og-image.jpg',
    siteName: 'Chidi Ogara Portfolio',
    contactEmail: 'chidi@example.com',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/chidiogara',
      github: 'https://github.com/chidiogara',
      twitter: 'https://twitter.com/chidiogara'
    }
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLocation('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    
    // Fetch data from API
    fetchInquiries();
    fetchBookings();
    fetchSiteSettings();
  }, [setLocation]);

  useEffect(() => {
    // Filter inquiries based on search term and status
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
    // Filter bookings based on search term and payment status
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
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
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

  const openEditModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditFormData(booking);
    setIsEditModalOpen(true);
  };

  const openViewModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const getStatusColor = (status: Inquiry['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'initiated': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setLocation('/admin/login');
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage inquiries, bookings and website settings</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            {/* Booking Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold">{bookings.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending Payment</p>
                      <p className="text-2xl font-bold text-gray-600">
                        {bookings.filter(b => b.paymentStatus === 'pending').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Paid Bookings</p>
                      <p className="text-2xl font-bold text-green-600">
                        {bookings.filter(b => b.paymentStatus === 'completed').length}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {bookings.filter(b => 
                          new Date(b.createdAt).getMonth() === new Date().getMonth()
                        ).length}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search bookings..."
                      value={bookingSearchTerm}
                      onChange={(e) => setBookingSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Payment Status</option>
                    <option value="pending">Pending</option>
                    <option value="initiated">Initiated</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{booking.name}</h3>
                          <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                            {booking.paymentStatus}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
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
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-900">
                            Service: {booking.service} | Project: {booking.projectType}
                          </p>
                          {booking.budget && (
                            <p className="text-sm text-gray-600">Budget: ${booking.budget}</p>
                          )}
                          {booking.timeline && (
                            <p className="text-sm text-gray-600">Timeline: {booking.timeline}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openViewModal(booking)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(booking)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="flex items-center gap-1">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the booking.
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

          <TabsContent value="inquiries" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Inquiries</p>
                      <p className="text-2xl font-bold">{inquiries.length}</p>
                    </div>
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">New</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {inquiries.filter(i => i.status === 'new').length}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">New</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {inquiries.filter(i => i.status === 'in-progress').length}
                      </p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Progress</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {inquiries.filter(i => i.status === 'completed').length}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Done</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search inquiries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Inquiries List */}
            <div className="space-y-4">
              {filteredInquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{inquiry.name}</h3>
                          <Badge className={getStatusColor(inquiry.status)}>
                            {inquiry.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
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
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-900">Service: {inquiry.service}</p>
                          <p className="text-sm text-gray-600 mt-1">{inquiry.message}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant={inquiry.status === 'new' ? 'default' : 'outline'}
                          onClick={() => updateInquiryStatus(inquiry.id, 'new')}
                        >
                          New
                        </Button>
                        <Button
                          size="sm"
                          variant={inquiry.status === 'in-progress' ? 'default' : 'outline'}
                          onClick={() => updateInquiryStatus(inquiry.id, 'in-progress')}
                        >
                          In Progress
                        </Button>
                        <Button
                          size="sm"
                          variant={inquiry.status === 'completed' ? 'default' : 'outline'}
                          onClick={() => updateInquiryStatus(inquiry.id, 'completed')}
                        >
                          Completed
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
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
                  <Label htmlFor="seoKeywords">Keywords (comma separated)</Label>
                  <Input
                    id="seoKeywords"
                    value={siteSettings.seoKeywords}
                    onChange={(e) => setSiteSettings({...siteSettings, seoKeywords: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ogImage">Open Graph Image URL</Label>
                  <Input
                    id="ogImage"
                    value={siteSettings.ogImage}
                    onChange={(e) => setSiteSettings({...siteSettings, ogImage: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Site Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={siteSettings.socialLinks.linkedin}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      socialLinks: {...siteSettings.socialLinks, linkedin: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    value={siteSettings.socialLinks.github}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      socialLinks: {...siteSettings.socialLinks, github: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    value={siteSettings.socialLinks.twitter}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      socialLinks: {...siteSettings.socialLinks, twitter: e.target.value}
                    })}
                  />
                </div>
                <Button onClick={saveSiteSettings} className="w-full">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Booking Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-project-type">Project Type</Label>
                  <Input
                    id="edit-project-type"
                    value={editFormData.projectType || ''}
                    onChange={(e) => setEditFormData({...editFormData, projectType: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-budget">Budget</Label>
                  <Input
                    id="edit-budget"
                    value={editFormData.budget || ''}
                    onChange={(e) => setEditFormData({...editFormData, budget: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-timeline">Timeline</Label>
                <Input
                  id="edit-timeline"
                  value={editFormData.timeline || ''}
                  onChange={(e) => setEditFormData({...editFormData, timeline: e.target.value})}
                />
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
                    <SelectItem value="initiated">Initiated</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-message">Message</Label>
                <Textarea
                  id="edit-message"
                  value={editFormData.message || ''}
                  onChange={(e) => setEditFormData({...editFormData, message: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Name</Label>
                    <p className="text-sm">{selectedBooking.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-sm">{selectedBooking.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <p className="text-sm">{selectedBooking.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Service</Label>
                    <p className="text-sm">{selectedBooking.service}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Project Type</Label>
                    <p className="text-sm">{selectedBooking.projectType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Budget</Label>
                    <p className="text-sm">{selectedBooking.budget ? `$${selectedBooking.budget}` : 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Timeline</Label>
                    <p className="text-sm">{selectedBooking.timeline || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Payment Status</Label>
                    <Badge className={getPaymentStatusColor(selectedBooking.paymentStatus)}>
                      {selectedBooking.paymentStatus}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Message</Label>
                  <p className="text-sm">{selectedBooking.message || 'No message provided'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Created At</Label>
                    <p className="text-sm">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Updated At</Label>
                    <p className="text-sm">{new Date(selectedBooking.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
