import { Switch, Route } from 'wouter';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Home from '@/pages/home';
import AdminDashboard from '@/pages/admin';
import ProjectDetails from '@/pages/project-details';
import CaseStudy from '@/pages/case-study';
import NotFound from '@/pages/not-found';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/project/:id" component={ProjectDetails} />
          <Route path="/case-study/:id" component={CaseStudy} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;