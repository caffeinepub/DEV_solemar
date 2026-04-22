import { Button } from "@/components/ui/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { CheckCircle, Loader2, Twitter, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useBackend } from "../hooks/use-backend";

type CallbackStatus = "loading" | "success" | "error";

interface SearchParams {
  code?: string;
  state?: string;
  error?: string;
}

export default function OAuthCallback() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as SearchParams;
  const { actor, isFetching } = useBackend();

  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const hasRun = useRef(false);

  const { code, state, error: oauthError } = search;

  useEffect(() => {
    // Only run once, and only when actor is ready
    if (hasRun.current || isFetching || !actor) return;

    // Handle OAuth provider-level errors immediately
    if (oauthError) {
      console.log("[OAuth] Provider returned error:", oauthError);
      setErrorMessage(oauthError);
      setStatus("error");
      hasRun.current = true;
      return;
    }

    if (!code || !state) {
      console.log("[OAuth] Missing code or state params");
      setErrorMessage("Missing OAuth parameters. Please try again.");
      setStatus("error");
      hasRun.current = true;
      return;
    }

    hasRun.current = true;

    async function handleCallback() {
      console.log(`[OAuth] Callback received, code=${code}, state=${state}`);

      try {
        // Step 1: Fetch client ID from backend
        const clientId = await actor!.getXClientId();
        console.log(
          "[OAuth] Fetched client ID from backend:",
          clientId ?? "(none)",
        );

        if (!clientId) {
          throw new Error(
            "No X Client ID configured. Please set it in Settings first.",
          );
        }

        // Step 2: Complete the OAuth flow on backend
        console.log("[OAuth] Calling completeOAuth on backend...");
        const result = await actor!.completeOAuth(code!, state!);

        if (result.__kind__ === "ok") {
          console.log("[OAuth] Success:", result.ok);
          setStatus("success");

          // Redirect to /settings after 2s
          setTimeout(() => {
            navigate({ to: "/settings" });
          }, 2000);
        } else {
          const errMsg =
            result.__kind__ === "err" ? result.err : "Unknown error";
          console.log("[OAuth] Error from backend:", errMsg);
          setErrorMessage(errMsg);
          setStatus("error");
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Unexpected error during OAuth";
        console.log("[OAuth] Exception:", msg);
        setErrorMessage(msg);
        setStatus("error");
      }
    }

    handleCallback();
  }, [actor, isFetching, code, state, oauthError, navigate]);

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16"
      data-ocid="oauth_callback.page"
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Twitter/X brand icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center shadow-lifted">
            <Twitter className="w-8 h-8 text-background" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Status area */}
        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="text-center"
              data-ocid="oauth_callback.loading_state"
            >
              <div className="flex justify-center mb-5">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Connecting Twitter
              </h1>
              <p className="text-muted-foreground">
                Completing your Twitter/X authorization…
              </p>
              <div className="mt-6 card-warm p-4 text-left space-y-2">
                <Step
                  done={false}
                  active
                  label="Verifying callback parameters"
                />
                <Step
                  done={false}
                  active={false}
                  label="Fetching stored Client ID"
                />
                <Step done={false} active={false} label="Exchanging tokens" />
              </div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="text-center"
              data-ocid="oauth_callback.success_state"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="flex justify-center mb-5"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle
                    className="w-9 h-9 text-primary"
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Twitter Connected!
              </h1>
              <p className="text-muted-foreground mb-6">
                Your Solemar account is now linked to Twitter/X. Bookings will
                be announced automatically.
              </p>
              <div className="bg-accent/20 border border-accent/30 rounded-xl px-5 py-4 text-sm text-foreground/80">
                🌊 Redirecting you to Settings in a moment…
              </div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="text-center"
              data-ocid="oauth_callback.error_state"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="flex justify-center mb-5"
              >
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle
                    className="w-9 h-9 text-destructive"
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Connection Failed
              </h1>
              <p className="text-muted-foreground mb-4">
                We couldn't complete the Twitter authorization.
              </p>
              {errorMessage && (
                <div className="bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3 mb-6 text-sm text-destructive text-left break-words">
                  {errorMessage}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/settings" })}
                  className="gap-2 transition-smooth"
                  data-ocid="oauth_callback.goto_settings_button"
                >
                  Go to Settings
                </Button>
                <Button
                  onClick={() => navigate({ to: "/settings" })}
                  className="gap-2 transition-smooth"
                  data-ocid="oauth_callback.retry_button"
                >
                  Retry in Settings
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface StepProps {
  done: boolean;
  active: boolean;
  label: string;
}

function Step({ done, active, label }: StepProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {done ? (
        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
      ) : active ? (
        <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
      )}
      <span
        className={
          active ? "text-foreground font-medium" : "text-muted-foreground"
        }
      >
        {label}
      </span>
    </div>
  );
}
