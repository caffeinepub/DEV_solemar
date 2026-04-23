import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldAlert,
  Terminal,
  Twitter,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useIsAdmin } from "../hooks/use-admin";
import { useBackend } from "../hooks/use-backend";

// ── Access Denied ────────────────────────────────────────────────────────────
function AccessDenied() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4"
      data-ocid="settings.access_denied"
    >
      <ShieldAlert className="w-14 h-14 text-destructive/60" />
      <h2 className="font-display text-2xl font-semibold text-foreground">
        Access Denied
      </h2>
      <p className="text-muted-foreground max-w-sm">
        This page is restricted to administrators only. Please log in with an
        admin account to continue.
      </p>
    </div>
  );
}

// ── Loading skeleton ─────────────────────────────────────────────────────────
function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" data-ocid="settings.loading_state">
      {[1, 2].map((i) => (
        <div key={i} className="card-warm p-6 space-y-4">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="h-4 w-80 bg-muted rounded" />
          <div className="h-10 w-full bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

// ── Client ID Section ────────────────────────────────────────────────────────
function ClientIdSection() {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();

  const [value, setValue] = useState("");
  const [showValue, setShowValue] = useState(false);

  const { data: currentClientId, isLoading: isLoadingId } = useQuery({
    queryKey: ["xClientId"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getXClientId();
    },
    enabled: !!actor && !isFetching,
  });

  // Do NOT pre-fill the editable input with the saved value — show it as a masked label instead
  useEffect(() => {
    if (currentClientId) setValue("");
  }, [currentClientId]);

  const saveMutation = useMutation({
    mutationFn: async (clientId: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.setXClientId(clientId);
    },
    onSuccess: () => {
      toast.success("Client ID saved successfully.");
      queryClient.invalidateQueries({ queryKey: ["xClientId"] });
    },
    onError: (err: Error) => {
      toast.error(`Failed to save Client ID: ${err.message}`);
    },
  });

  const isSaved = !!currentClientId;

  return (
    <section
      className="card-warm p-6 space-y-5"
      data-ocid="settings.client_id.panel"
    >
      <div className="flex items-start gap-3">
        <KeyRound className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            OAuth 2.0 Client ID for X
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Single global value used for the PKCE OAuth flow. Obtained from the
            X Developer Portal.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Status:
        </span>
        {isLoadingId ? (
          <Badge
            variant="secondary"
            data-ocid="settings.client_id.loading_state"
          >
            Checking…
          </Badge>
        ) : isSaved ? (
          <Badge
            className="bg-primary/15 text-primary border-primary/30"
            data-ocid="settings.client_id.success_state"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" /> Saved
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="bg-accent/30 text-foreground border-accent/40"
            data-ocid="settings.client_id.error_state"
          >
            <XCircle className="w-3 h-3 mr-1" /> Not set
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-id" className="text-sm font-medium">
          {currentClientId ? "Update Client ID" : "Client ID"}
        </Label>
        {currentClientId && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted border border-border font-mono text-sm text-muted-foreground select-none">
            <span className="flex-1 tracking-widest">
              {showValue
                ? currentClientId
                : `${"•".repeat(Math.min(currentClientId.length, 24))}`}
            </span>
            <button
              type="button"
              aria-label={showValue ? "Hide Client ID" : "Show Client ID"}
              onClick={() => setShowValue((v) => !v)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="settings.client_id.toggle"
            >
              {showValue ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="client-id"
              data-ocid="settings.client_id.input"
              type="text"
              placeholder={
                currentClientId
                  ? "Enter new Client ID to replace…"
                  : "Enter your X OAuth 2.0 Client ID"
              }
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <Button
            data-ocid="settings.client_id.save_button"
            onClick={() => saveMutation.mutate(value.trim())}
            disabled={!value.trim() || saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Save
          </Button>
        </div>
      </div>
    </section>
  );
}

// ── Twitter Connection Section ────────────────────────────────────────────────
function TwitterConnectionSection() {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();

  const {
    data: twitterStatus,
    isLoading: isLoadingStatus,
    error: statusError,
  } = useQuery({
    queryKey: ["twitterStatus"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTwitterStatus();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true,
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const params = await actor.getOAuthStartParams(
        `${window.location.origin}/oauth-callback`,
      );
      // Persist PKCE state so OAuthCallback can complete the flow
      sessionStorage.setItem("oauth_state", params.state);
      sessionStorage.setItem("oauth_code_verifier", params.codeVerifier);
      window.location.href = params.authUrl;
    },
    onError: (err: Error) => {
      toast.error(`Could not start OAuth flow: ${err.message}`);
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.disconnectTwitter();
    },
    onSuccess: () => {
      toast.success("Twitter / X disconnected.");
      queryClient.invalidateQueries({ queryKey: ["twitterStatus"] });
    },
    onError: (err: Error) => {
      toast.error(`Failed to disconnect: ${err.message}`);
    },
  });

  const isConnected = twitterStatus?.connected ?? false;

  return (
    <section
      className="card-warm p-6 space-y-5"
      data-ocid="settings.twitter.panel"
    >
      <div className="flex items-start gap-3">
        <Twitter className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            Twitter / X Connection
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Authorize Solemar to post tweets automatically when a new booking is
            received.
          </p>
        </div>
      </div>

      {isLoadingStatus ? (
        <div
          className="flex items-center gap-2 text-sm text-muted-foreground"
          data-ocid="settings.twitter.loading_state"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Checking connection status…
        </div>
      ) : statusError ? (
        <div
          className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
          data-ocid="settings.twitter.error_state"
        >
          <XCircle className="w-4 h-4 flex-shrink-0" />
          Could not load connection status.
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Status:
          </span>
          {isConnected ? (
            <Badge
              className="bg-primary/15 text-primary border-primary/30"
              data-ocid="settings.twitter.success_state"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Connected
              {twitterStatus?.username ? ` · @${twitterStatus.username}` : ""}
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-accent/30 text-foreground border-accent/40"
              data-ocid="settings.twitter.disconnected_state"
            >
              <XCircle className="w-3 h-3 mr-1" />
              Not connected
            </Badge>
          )}
        </div>
      )}

      <Separator className="bg-border/60" />

      <div className="flex flex-wrap gap-3">
        {!isConnected ? (
          <Button
            data-ocid="settings.twitter.connect_button"
            onClick={() => connectMutation.mutate()}
            disabled={connectMutation.isPending || isLoadingStatus}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {connectMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Twitter className="w-4 h-4 mr-2" />
            )}
            Connect X / Twitter
          </Button>
        ) : (
          <Button
            variant="destructive"
            data-ocid="settings.twitter.disconnect_button"
            onClick={() => disconnectMutation.mutate()}
            disabled={disconnectMutation.isPending}
          >
            {disconnectMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            Disconnect X / Twitter
          </Button>
        )}
      </div>
    </section>
  );
}

// ── Canister State Panel ──────────────────────────────────────────────────────
function CanisterStatePanel() {
  const { actor, isFetching } = useBackend();

  const {
    data: stateText,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["canisterState"],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as unknown as { state: () => Promise<string> }).state();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });

  return (
    <section
      className="card-warm p-6 space-y-5 h-full"
      data-ocid="settings.canister_state.panel"
    >
      <div className="flex items-start gap-3">
        <Terminal className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            Canister State
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Live debug snapshot. Refreshes every 5 seconds.
          </p>
        </div>
      </div>

      <Separator className="bg-border/60" />

      {isLoading ? (
        <div
          className="flex items-center gap-2 text-sm text-muted-foreground"
          data-ocid="settings.canister_state.loading_state"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading state…
        </div>
      ) : error ? (
        <div
          className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
          data-ocid="settings.canister_state.error_state"
        >
          <XCircle className="w-4 h-4 flex-shrink-0" />
          Failed to load canister state.
        </div>
      ) : (
        <pre
          className="overflow-auto rounded-lg bg-foreground/5 text-primary font-mono text-xs p-4 max-h-[28rem] whitespace-pre-wrap break-all border border-border"
          data-ocid="settings.canister_state.output"
        >
          {stateText ?? "(no data)"}
        </pre>
      )}
    </section>
  );
}

// ── Main Settings page ────────────────────────────────────────────────────────
export default function Settings() {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) return <SettingsSkeleton />;
  if (!isAdmin) return <AccessDenied />;

  return (
    <main
      className="container mx-auto px-4 py-12 max-w-6xl"
      data-ocid="settings.page"
    >
      {/* Page header */}
      <div className="space-y-1 mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your Twitter / X integration and OAuth credentials.
        </p>
      </div>

      {/* Two-column layout: OAuth settings left, canister state right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left column: existing OAuth sections */}
        <div className="space-y-8">
          <ClientIdSection />
          <TwitterConnectionSection />
        </div>

        {/* Right column: canister state debug panel */}
        <div>
          <CanisterStatePanel />
        </div>
      </div>
    </main>
  );
}
