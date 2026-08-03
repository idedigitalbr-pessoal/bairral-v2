import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { PermissionProvider } from './context/PermissionContext';
import { SessionExpiredDialog } from './components/auth/SessionExpiredDialog';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PermissionProvider>
            <SessionExpiredDialog />
            <AppRoutes />
          </PermissionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
