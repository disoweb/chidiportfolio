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
import { CalendarDays, Clock, DollarSign, MessageSquare, User, Mail } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['/api/client/projects', clientEmail],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/client/projects/${encodeURIComponent(clientEmail)}`);
      return response.json();
    },
    enabled: !!clientEmail,
  });

  const { data: projectUpdates = [] } = useQuery({
    queryKey: ['/api/projects/updates', selectedProject?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/projects/${selectedProject?.id}/updates`);
      return response.json();
    },
    enabled: !!selectedProject?.id,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['/api/projects/messages', selectedProject?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/projects/${selectedProject?.id}/messages`);
      return response.json();
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
      await apiRequest('POST', `/api/projects/${selectedProject.id}/messages`, {
        senderId: 0, // Client ID (would be from auth)
        senderType: 'client',
        recipientId: 1, // Admin ID
        recipientType: 'admin',
        subject: newMessage.subject,
        message: newMessage.message,
      });

      setNewMessage({ subject: '', message: '' });
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the project manager.",
      });
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

  if (!clientEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Client Access</CardTitle>
            <CardDescription>Enter your email to access your project dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="your.email@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
              <Button 
                className="w-full"
                onClick={() => {
                  if (clientEmail) {
                    localStorage.setItem('clientEmail', clientEmail);
                    window.location.search = `?email=${encodeURIComponent(clientEmail)}`;
                  }
                }}
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Project Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your projects.</p>
            <div className="flex items-center gap-2 mt-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">{clientEmail}</span>
            </div>
          </div>

          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
                <p className="text-gray-600 text-center mb-4">
                  We couldn't find any projects associated with this email address.
                </p>
                <Button onClick={() => window.location.href = '/#booking'}>
                  Book a New Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project: Project) => (
                <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                        <span className="text-sm font-medium capitalize">{project.status}</span>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{project.assignedTo}</span>
                        </div>
                        {project.budget && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{project.budget}</span>
                          </div>
                        )}
                      </div>

                      {project.dueDate && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <CalendarDays className="h-4 w-4" />
                          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setSelectedProject(project)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{project.name}</DialogTitle>
                            <DialogDescription>{project.description}</DialogDescription>
                          </DialogHeader>

                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="updates">Updates</TabsTrigger>
                              <TabsTrigger value="messages">Messages</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <h4 className="font-semibold mb-2">Project Status</h4>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                                    <span className="capitalize">{project.status}</span>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Progress</h4>
                                  <div className="space-y-2">
                                    <Progress value={project.progress} />
                                    <span className="text-sm text-gray-600">{project.progress}% complete</span>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Assigned To</h4>
                                  <p>{project.assignedTo}</p>
                                </div>

                                {project.budget && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Budget</h4>
                                    <p>{project.budget}</p>
                                  </div>
                                )}
                              </div>
                            </TabsContent>

                            <TabsContent value="updates" className="space-y-4">
                              <h4 className="font-semibold">Project Updates</h4>
                              {projectUpdates.length === 0 ? (
                                <p className="text-gray-600">No updates available yet.</p>
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
                                  {messages.map((message: Message) => (
                                    <Card key={message.id}>
                                      <CardContent className="pt-4">
                                        <div className="flex justify-between items-start mb-2">
                                          <h5 className="font-medium">{message.subject}</h5>
                                          <div className="text-xs text-gray-500">
                                            <div>{message.senderType === 'admin' ? 'Team' : 'You'}</div>
                                            <div>{new Date(message.createdAt).toLocaleDateString()}</div>
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-600">{message.message}</p>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>

                                <div className="border-t pt-4">
                                  <h5 className="font-medium mb-3">Send Message</h5>
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
                                    />
                                    <Button onClick={sendMessage}>
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Send Message
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}