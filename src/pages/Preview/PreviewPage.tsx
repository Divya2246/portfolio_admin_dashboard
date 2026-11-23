import { useAuth } from '../../hooks';
import { useAppSelector } from '../../redux';
import { submitContactMessage } from '../../firebase/services/contactSubmissions.service';
import { DashboardHeader } from '../Dashboard/DashboardHeader';
import { PortfolioDisplay } from '../../portfolio-display';

export function PreviewPage() {
  const portfolio = useAppSelector((s) => s.portfolio.data);
  const { user } = useAuth();

  const handleSubmitContact = async (payload: { name: string; email: string; message: string }) => {
    if (!user?.uid) throw new Error('Not logged in');
    await submitContactMessage(user.uid, payload);
  };

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-canvas text-ink">
        <DashboardHeader />
        <main className="shell flex flex-1 items-center justify-center pb-10 pt-28">
          <div className="panel max-w-lg px-6 py-10 text-center">
            <p className="mb-0 text-ink-secondary">No portfolio data yet. Use Edit to add content and save.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <DashboardHeader />
      <main className="pb-8 pt-20">
        <PortfolioDisplay
          data={portfolio}
          onSubmitContact={user?.uid ? handleSubmitContact : undefined}
        />
      </main>
    </div>
  );
}
