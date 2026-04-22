import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import { LogIn, Settings, Waves } from "lucide-react";
import { useIsAdmin } from "../hooks/use-admin";

interface NavigationProps {
  // `initialized` prop kept for API compatibility but no longer passed to useIsAdmin
  initialized?: boolean;
}

export function Navigation({ initialized: _initialized }: NavigationProps) {
  // Hook is now self-contained — no external initialized gate needed
  const { isAdmin } = useIsAdmin();
  const { login, clear, isAuthenticated, isInitializing, identity } =
    useInternetIdentity();
  // Anonymous principal constant — guard logout button from showing for unauthenticated actors
  const principalText = identity?.getPrincipal().toText() ?? "2vxsx-fae"; // fallback is the ICP anonymous principal
  // Anonymous principal — guard both canonical form and "anonymous" string
  const isAnonymousPrincipal =
    principalText === "2vxsx-fae" || principalText === "anonymous";

  return (
    <nav className="bg-card border-b border-primary/10 shadow-ambient sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          data-ocid="nav.logo_link"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-ambient">
            <Waves className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors duration-200">
            Solemar
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <NavLink to="/" label="Home" ocid="nav.home_link" />
          {isAdmin && (
            <NavLink
              to="/settings"
              label="Settings"
              icon={<Settings className="w-3.5 h-3.5" />}
              ocid="nav.settings_link"
            />
          )}
          {isInitializing ? (
            <span className="px-3.5 py-2 text-sm text-muted-foreground">
              Loading...
            </span>
          ) : isAuthenticated && !isAnonymousPrincipal ? (
            <button
              type="button"
              onClick={clear}
              data-ocid="nav.logout_button"
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-body font-medium",
                "text-muted-foreground hover:text-foreground hover:bg-primary/5",
                "transition-smooth",
              )}
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={login}
              data-ocid="nav.login_button"
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-body font-medium",
                "text-primary hover:text-primary/80 hover:bg-primary/5",
                "transition-smooth",
              )}
            >
              <LogIn className="w-3.5 h-3.5" />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  ocid: string;
}

function NavLink({ to, label, icon, ocid }: NavLinkProps) {
  return (
    <Link
      to={to}
      data-ocid={ocid}
      className={cn(
        "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-body font-medium",
        "text-muted-foreground hover:text-foreground hover:bg-primary/5",
        "transition-smooth",
      )}
      activeProps={{ className: "text-primary bg-primary/8 font-semibold" }}
    >
      {icon}
      {label}
    </Link>
  );
}
