import { useState } from 'react';
import { TaskInputScreen } from './components/TaskInputScreen';
import { Dashboard } from './components/Dashboard';
import { Skeleton } from './components/ui/skeleton';
import { ClickUpService } from './services/clickup.service';
import type { DashboardData } from './types/clickup';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';

type AppState = 'input' | 'loading' | 'dashboard' | 'error';

function App() {
  const [state, setState] = useState<AppState>('input');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string>('');

  const handleTaskSubmit = async (taskId: string, apiKey: string) => {
    setState('loading');
    setError('');

    try {
      const service = new ClickUpService(apiKey);
      const tasks = await service.getTasks(taskId);
      const transformedData = service.transformTasksData(tasks);
      
      setDashboardData(transformedData);
      setState('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setState('error');
    }
  };

  const handleBack = () => {
    setState('input');
    setDashboardData(null);
    setError('');
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-48" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Error Loading Task</h2>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
            </div>
            <Button onClick={handleBack} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === 'dashboard' && dashboardData) {
    return <Dashboard data={dashboardData} onBack={handleBack} />;
  }

  return <TaskInputScreen onSubmit={handleTaskSubmit} />;
}

export default App;

