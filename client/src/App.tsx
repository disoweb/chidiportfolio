import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import AdminLogin from "@/pages/admin-login";
import Admin from "@/pages/admin";
import CreateAdmin from "@/pages/create-admin";
import ClientDashboard from "@/pages/client-dashboard";
import NotFound from "@/pages/not-found";
import CaseStudy from "@/pages/case-study";
import ProjectDetails from "@/pages/project-details";
import PaymentCallback from "@/pages/payment-callback";
import PaymentSuccess from "@/pages/payment-success";
import PaymentFailed from "@/pages/payment-failed";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/admin/login" component={AdminLogin} />
              <Route path="/admin" component={Admin} />
              <Route path="/admin/create" component={CreateAdmin} />
              <Route path="/client/dashboard" component={ClientDashboard} />
              <Route path="/payment/callback" component={PaymentCallback} />
              <Route path="/payment/success" component={PaymentSuccess} />
              <Route path="/payment/failed" component={PaymentFailed} />
              <Route path="/case-study/:id" component={CaseStudy} />
              <Route path="/project/:id" component={ProjectDetails} />
              <Route component={NotFound} />
            </Switch>
            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;