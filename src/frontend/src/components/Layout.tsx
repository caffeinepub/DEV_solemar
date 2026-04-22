import { useEffect, useState } from "react";
import { useBackend } from "../hooks/use-backend";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { actor, isFetching } = useBackend();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!actor || isFetching || initialized) return;
    actor
      ._initializeAccessControl()
      .then(() => setInitialized(true))
      .catch(() => setInitialized(true));
  }, [actor, isFetching, initialized]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation initialized={initialized} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "solemar",
  )}`;

  return (
    <footer className="bg-card border-t border-primary/10 shadow-ambient">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-display text-lg font-semibold text-foreground">
              Solemar
            </span>
            <span className="text-xs text-muted-foreground font-body">
              Seaside Flat · Muro Alto, PE, Brasil
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground font-body">
            <a
              href="mailto:contact@solemar.com"
              className="hover:text-primary transition-colors duration-200"
            >
              Contact
            </a>
            <span className="text-border">·</span>
            <span>Muro Alto, Pernambuco, Brasil</span>
          </div>

          {/* Attribution */}
          <p className="text-xs text-muted-foreground font-body">
            © {year}. Built with love using{" "}
            <a
              href={utmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-200 underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
