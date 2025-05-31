
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Mail, Phone, Calendar, Settings, Globe, Search } from 'lucide-react';

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
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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
    // Fetch inquiries from API
    fetchInquiries();
    fetchSiteSettings();
  }, []);

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

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/admin/inquiries');
      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
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

  const getStatusColor = (status: Inquiry['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage inquiries and website settings</p>
        </div>

        <Tabs defaultValue="inquiries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

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
      </div>
    </div>
  );
}
