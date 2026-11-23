import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { useAppDispatch } from '../../redux';
import { clearPortfolioAsync } from '../../redux/slices/portfolioSlice';
import { ROUTES } from '../../constants';
import { ThemeToggle } from '../../common/theme/ThemeToggle';
import { BrandLogo } from '../../common/components/BrandLogo/BrandLogo';

const linkClass = ({ isActive }: { isActive: boolean }) => `nav-pill w-full lg:w-auto ${isActive ? 'active' : ''}`;

interface DashboardHeaderProps {
  /** When set, a Save button is shown before Edit and submits this form. */
  saveFormId?: string;
  saving?: boolean;
}

export function DashboardHeader({ saveFormId, saving = false }: DashboardHeaderProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, signOut: doSignOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await doSignOut();
  };

  const handleClear = async () => {
    if (!user?.uid) return;
    if (typeof window !== 'undefined' && window.confirm('Clear all portfolio data from Firebase? This cannot be undone.')) {
      setMobileMenuOpen(false);
      await dispatch(clearPortfolioAsync(user.uid));
      navigate(ROUTES.DASHBOARD);
    }
  };

  const saveButton = saveFormId ? (
    <button type="submit" form={saveFormId} disabled={saving} className="btn btn-primary w-full shrink-0 lg:w-auto">
      {saving ? 'Saving…' : 'Save'}
    </button>
  ) : null;

  const navLinks = (
    <>
      <NavLink to={ROUTES.DASHBOARD} end className={linkClass} onClick={() => setMobileMenuOpen(false)}>
        Edit
      </NavLink>
      <NavLink to={ROUTES.PREVIEW} className={linkClass} onClick={() => setMobileMenuOpen(false)}>
        Preview
      </NavLink>
      <NavLink to={ROUTES.MESSAGES} className={linkClass} onClick={() => setMobileMenuOpen(false)}>
        Messages
      </NavLink>
      <button type="button" onClick={handleClear} className="btn btn-secondary w-full lg:w-auto">
        Clear
      </button>
      <button type="button" onClick={handleSignOut} className="btn btn-secondary w-full lg:w-auto">
        Sign out
      </button>
    </>
  );

  return (
    <header className="topbar">
      <div className="shell flex items-center justify-between gap-3 py-3">
        <BrandLogo />

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-2 lg:flex">
            {saveButton}
            {navLinks}
          </nav>
          <ThemeToggle />
          {saveFormId ? (
            <button type="submit" form={saveFormId} disabled={saving} className="btn btn-primary px-4 lg:hidden">
              {saving ? 'Saving…' : 'Save'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="icon-btn lg:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-line bg-surface transition-[max-height,opacity] duration-200 lg:hidden ${
          mobileMenuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="shell flex flex-col gap-2 py-3">{navLinks}</nav>
      </div>
    </header>
  );
}
