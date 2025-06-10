import { Route, Switch } from 'wouter';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { useSiteSettings } from '@/hooks/use-site-settings';
import Home from '@/pages/home';
import AdminDashboard from '@/pages/admin';
import AdminLogin from '@/pages/admin-login';
import CreateAdmin from "./pages/create-admin";
import ClientDashboard from '@/pages/client-dashboard';
import NotFound from '@/pages/not-found';
import CaseStudy from '@/pages/case-study';
import ProjectDetails from '@/pages/project-details';
import PaymentCallback from '@/pages/payment-callback';

function App() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (settings) {
      document.title = settings.seoTitle;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', settings.seoDescription);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = settings.seoDescription;
        document.head.appendChild(meta);
      }

      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', settings.seoKeywords);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = settings.seoKeywords;
        document.head.appendChild(meta);
      }
    }
  }, [settings]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/create-admin" component={CreateAdmin} />
            <Route path="/client-dashboard" component={ClientDashboard} />
            <Route path="/project/:id" component={ProjectDetails} />
            <Route path="/case-study/:id" component={CaseStudy} />
            <Route path="/payment/callback" component={PaymentCallback} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
export default App;