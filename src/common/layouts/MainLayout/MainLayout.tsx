import { type ReactNode } from 'react';
import { useAppSelector } from '../../../redux';

interface MainLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export function MainLayout({ children, sidebar }: MainLayoutProps) {
  const sidebarOpen = useAppSelector((state) => state.app.sidebarOpen);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {sidebar && (
        <aside className={sidebarOpen ? 'w-64' : 'hidden'}>
          {sidebar}
        </aside>
      )}
      {children}
    </div>
  );
}
