import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import { Toaster } from "sonner";
import { Login } from "./pages/auth/Login";
import { AdminLayout } from "./components/layout/AdminLayout";
import { DashboardHome } from "./pages/dashboard/DashboardHome";
import { UserManagement } from "./pages/Users/UserManagement";
import { UserDetails } from "./pages/Users/UserDetails";
import { SubscriptionBillings } from "./pages/Subscriptions/SubscriptionBillings";
import { EmailsNotifications } from "./pages/CMS/EmailsNotifications";
import { ComposeMessage } from "./pages/CMS/components/ComposeMessage";
import { MessageDetails } from "./pages/CMS/components/MessageDetails";
import { FaqsList } from "./pages/CMS/FAQs";
import { FaqCreateEdit } from "./pages/CMS/components/FaqCreateEdit";
import { SupportFeedback } from "./pages/Support/SupportFeedback";
import { CategorizationRules } from "./pages/Categorization/CategorizationRules";
import { Settings } from "./pages/Settings/Settings";

// 👉 Create the client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents spamming the API when switching tabs
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = true; 
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  return (
    // 👉 Wrap the app
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route path="/dashboard">
            <Route index element={
              <ProtectedRoute>
                  <DashboardHome />
              </ProtectedRoute>
            } />
            
            <Route path="users" element={
              <ProtectedRoute>
                  <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="users/:id" element={
              <ProtectedRoute><UserDetails /></ProtectedRoute>
            } />
            <Route path="billing" element={
              <ProtectedRoute><SubscriptionBillings /></ProtectedRoute>
            } />
            <Route path="content/emails" element={
              <ProtectedRoute><EmailsNotifications /></ProtectedRoute>
            } />
            <Route path="content/emails/compose" element={
  <ProtectedRoute><ComposeMessage /></ProtectedRoute>
} />
<Route path="content/emails/:id" element={
  <ProtectedRoute><MessageDetails /></ProtectedRoute>
} />
<Route path="content/faqs" element={
  <ProtectedRoute><FaqsList /></ProtectedRoute>
} />
<Route path="content/faqs/new" element={
  <ProtectedRoute><FaqCreateEdit /></ProtectedRoute>
} />
<Route path="content/faqs/:id" element={
  <ProtectedRoute><FaqCreateEdit /></ProtectedRoute>
} />
<Route path="support" element={
  <ProtectedRoute><SupportFeedback /></ProtectedRoute>
} />
<Route path="categorization" element={
  <ProtectedRoute><CategorizationRules /></ProtectedRoute>
} />
<Route path="settings" element={
  <ProtectedRoute><Settings /></ProtectedRoute>
} />
            </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;