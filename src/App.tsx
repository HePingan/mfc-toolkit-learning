import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <ErrorBoundary>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </ErrorBoundary>
  );
}
