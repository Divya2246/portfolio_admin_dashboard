import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks';
import { DashboardHeader } from '../Dashboard/DashboardHeader';
import { getContactSubmissions, type ContactSubmission } from '../../firebase/services/contactSubmissions.service';

function formatDate(value: unknown): string {
  if (value == null) return '—';
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }
  return String(value);
}

function getInitial(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name.trim()[0] || '?').toUpperCase();
}

export function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getContactSubmissions(user.uid)
      .then((list) => {
        if (!cancelled) setMessages(list);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load messages.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user?.uid]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <DashboardHeader />
      <main className="shell pb-10 pt-24">
        <section className="stage mb-5">
          <div className="relative">
            <p className="mb-1 text-sm text-signal">Inbox</p>
            <h1 className="mb-1 text-2xl font-semibold text-ink sm:text-3xl">Messages</h1>
            <p className="mb-0 text-sm text-ink-secondary">Messages sent through the contact form on your portfolio.</p>
          </div>
        </section>

        {error && (
          <div className="mb-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {loading ? (
          <div className="panel flex flex-col items-center justify-center px-6 py-16 text-muted">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-line border-t-accent" aria-hidden />
            <p className="mb-0 text-sm">Loading messages…</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="panel border-dashed px-6 py-14 text-center">
            <h2 className="mb-2 text-lg font-semibold text-ink">No messages yet</h2>
            <p className="mx-auto mb-0 max-w-sm text-sm text-muted">
              When someone sends a message through your portfolio contact form, it will show up here.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </p>
            <ul className="space-y-3">
              {messages.map((msg) => (
                <li key={msg.id ?? msg.email + String(msg.createdAt)} className="panel p-4 sm:p-5">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 font-semibold text-accent" aria-hidden>
                      {getInitial(msg.name || '')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-semibold text-ink">{msg.name || '—'}</span>
                        <a href={`mailto:${msg.email}`} className="text-link text-sm">{msg.email}</a>
                        <span className="text-xs text-muted sm:ml-auto">{formatDate(msg.createdAt)}</span>
                      </div>
                      <p className="mb-0 whitespace-pre-wrap text-sm leading-relaxed text-ink-secondary">{msg.message || '—'}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
