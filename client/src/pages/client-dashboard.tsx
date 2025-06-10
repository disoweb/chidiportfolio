
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Clock, DollarSign, MessageSquare, User, Mail, CheckCircle, AlertCircle, Briefcase, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface ProjectUpdate {
  id: number;
  title: string;
  description: string;
  updateType: string;
  createdAt: string;
}

interface Message {
  id: number;
  subject: string;
  message: string;
  senderType: string;
  createdAt: string;
}

export default function ClientDashboard() {
  const [clientEmail, setClientEmail] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newMessage, setNewMessage] = useState({ subject: '', message: '' });
  const { toast } = useToast();

  // Get client email from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || localStorage.getItem('clientEmail') || '';
    setClientEmail(email);
    if (email) {
      localStorage.setItem('clientEmail', email);
    }
  }, []);

  const { data: projects = [], isLoading: loadingProjects, error: projectsError, refetch } = useQuery({
    queryKey: ['/api/client/projects', clientEmail],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/client/projects/${encodeURIComponent(clientEmail)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        return [];
      }
    },
    enabled: !!clientEmail,
    retry: 2,
    retryDelay: 1000,
  });

  const { data: projectUpdates = [] } = useQuery({
    queryKey: ['/api/projects/updates', selectedProject?.id],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/projects/${selectedProject?.id}/updates`);
        if (!response.ok) return [];
        return response.json();
      } catch (error) {
        console.error('Failed to fetch project updates:', error);
        return [];
      }
    },
    enabled: !!selectedProject?.id,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['/api/projects/messages', selectedProject?.id],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/projects/${selectedProject?.id}/messages`);
        if (!response.ok) return [];
        return response.json();
      } catch (error) {
        console.error('Failed to fetch project messages:', error);
        return [];
      }
    },
    enabled: !!selectedProject?.id,
  });

  const sendMessage = async () => {
    if (!selectedProject || !newMessage.subject || !newMessage.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: 0, // Client ID (would be from auth)
          senderType: 'client',
          recipientId: 1, // Admin ID
          recipientType: 'admin',
          subject: newMessage.subject,
          message: newMessage.message,
        })
      });

      if (response.ok) {
        setNewMessage({ subject: '', message: '' });
        toast({
          title: "Message Sent",
          description: "Your message has been sent to the project manager.",
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'testing': return AlertCircle;
      case 'planning': return Target;
      case 'on-hold': return AlertCircle;
      default: return Clock;
    }
  };

  if (!clientEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Client Access</CardTitle>
            <CardDescription>Enter your email to access your project dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="your.email@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="text-center"
                />
              </div>
              <Button 
                className="w-full"
                onClick={() => {
                  if (clientEmail) {
                    localStorage.setItem('clientEmail', clientEmail);
                    const url = new URL(window.location.href);
                    url.searchParams.set('email', clientEmail);
                    window.history.replaceState({}, '', url.toString());
                    window.location.reload();
                  }
                }}
                disabled={!clientEmail}
              >
                Access Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loadingProjects) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-red-600">Error</CardTitle>
            <CardDescription>Failed to load your projects. Please try again.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={() => refetch()} className="w-full">
                Retry
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.removeItem('clientEmail');
                  window.location.reload();
                }} 
                className="w-full"
              >
                Change Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Dashboard</h1>
            <p className="text-gray-600 mb-4">Welcome back! Here's an overview of your projects with us.</p>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">{clientEmail}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  localStorage.removeItem('clientEmail');
                  window.location.reload();
                }}
                className="ml-auto"
              >
                Change Email
              </Button>
            </div>
          </div>
        </div>

        {projects.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                We couldn't find any projects associated with this email address. If you have recently booked a service, it may take some time to appear here.
              </p>
              <Button onClick={() => window.location.href = '/#booking'} size="lg">
                Book a New Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: Project) => {
              const StatusIcon = getStatusIcon(project.status);
              
              return (
                <Card key={project.id} className="cursor-pointer hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 line-clamp-1">{project.name}</CardTitle>
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
                      <StatusIcon className="w-5 h-5 text-gray-400" />
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

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            className="w-full"
                            onClick={() => setSelectedProject(project)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Briefcase className="w-5 h-5" />
                              {project.name}
                            </DialogTitle>
                            <DialogDescription>{project.description}</DialogDescription>
                          </DialogHeader>

                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="updates">Updates</TabsTrigger>
                              <TabsTrigger value="messages">Messages</TabsTrigger>
                            </TabsList>

                            <div className="max-h-[60vh] overflow-y-auto">
                              <TabsContent value="overview" className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base">Project Status</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${getStatusColor(project.status)}`} />
                                        <span className="capitalize font-medium">{project.status}</span>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base">Progress</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        <Progress value={project.progress} />
                                        <span className="text-sm text-gray-600">{project.progress}% complete</span>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base">Team</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span>{project.assignedTo}</span>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {project.budget && (
                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Budget</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex items-center gap-2">
                                          <DollarSign className="w-4 h-4 text-gray-400" />
                                          <span>{project.budget}</span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </div>

                                {(project.startDate || project.dueDate) && (
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base">Timeline</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid gap-2 md:grid-cols-2">
                                        {project.startDate && (
                                          <div>
                                            <p className="text-sm text-muted-foreground">Start Date</p>
                                            <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                                          </div>
                                        )}
                                        {project.dueDate && (
                                          <div>
                                            <p className="text-sm text-muted-foreground">Due Date</p>
                                            <p className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</p>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </TabsContent>

                              <TabsContent value="updates" className="space-y-4">
                                <h4 className="font-semibold">Project Updates</h4>
                                {projectUpdates.length === 0 ? (
                                  <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-8">
                                      <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
                                      <p className="text-gray-600 text-center">No updates available yet.</p>
                                      <p className="text-sm text-gray-500 text-center mt-1">Check back later for project updates.</p>
                                    </CardContent>
                                  </Card>
                                ) : (
                                  <div className="space-y-3">
                                    {projectUpdates.map((update: ProjectUpdate) => (
                                      <Card key={update.id}>
                                        <CardContent className="pt-4">
                                          <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-medium">{update.title}</h5>
                                            <span className="text-xs text-gray-500">
                                              {new Date(update.createdAt).toLocaleDateString()}
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-600">{update.description}</p>
                                          <Badge variant="outline" className="mt-2 text-xs">
                                            {update.updateType}
                                          </Badge>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                )}
                              </TabsContent>

                              <TabsContent value="messages" className="space-y-4">
                                <div className="space-y-4">
                                  <h4 className="font-semibold">Project Communication</h4>

                                  <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {messages.length === 0 ? (
                                      <Card>
                                        <CardContent className="flex flex-col items-center justify-center py-8">
                                          <MessageSquare className="w-8 h-8 text-gray-400 mb-2" />
                                          <p className="text-gray-600 text-center">No messages yet.</p>
                                          <p className="text-sm text-gray-500 text-center mt-1">Start a conversation with your project team.</p>
                                        </CardContent>
                                      </Card>
                                    ) : (
                                      messages.map((message: Message) => (
                                        <Card key={message.id}>
                                          <CardContent className="pt-4">
                                            <div className="flex justify-between items-start mb-2">
                                              <h5 className="font-medium">{message.subject}</h5>
                                              <div className="text-xs text-gray-500 text-right">
                                                <div>{message.senderType === 'admin' ? 'Team' : 'You'}</div>
                                                <div>{new Date(message.createdAt).toLocaleDateString()}</div>
                                              </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{message.message}</p>
                                          </CardContent>
                                        </Card>
                                      ))
                                    )}
                                  </div>

                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base">Send Message</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3">
                                        <Input
                                          placeholder="Subject"
                                          value={newMessage.subject}
                                          onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                                        />
                                        <Textarea
                                          placeholder="Your message..."
                                          value={newMessage.message}
                                          onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                                          rows={3}
                                        />
                                        <Button onClick={sendMessage} className="w-full">
                                          <MessageSquare className="h-4 w-4 mr-2" />
                                          Send Message
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TabsContent>
                            </div>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
