import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../common/components';
import { ROUTES } from '../../constants';

export function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Portfolio Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Manage your portfolio content from here.</p>
          <Link to={ROUTES.DASHBOARD}>
            <Button>Go to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
