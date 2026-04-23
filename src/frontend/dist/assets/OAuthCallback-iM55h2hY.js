import { a as useNavigate, d as useSearch, u as useBackend, r as reactExports, j as jsxRuntimeExports } from "./index-Dd8MKinj.js";
import { B as Button } from "./button-Ds8iXPAQ.js";
import { m as motion } from "./proxy-BXx8VQPW.js";
import { T as Twitter } from "./twitter-CY4fDCb2.js";
import { A as AnimatePresence } from "./index-b0ESQlbc.js";
import { L as LoaderCircle } from "./loader-circle-i7MVWeq-.js";
import { C as CircleCheckBig } from "./circle-check-big-D72002sg.js";
import { C as CircleX } from "./circle-x-CskoSnKM.js";
function OAuthCallback() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { actor, isFetching } = useBackend();
  const [status, setStatus] = reactExports.useState("loading");
  const [errorMessage, setErrorMessage] = reactExports.useState("");
  const hasRun = reactExports.useRef(false);
  const { code, state, error: oauthError } = search;
  reactExports.useEffect(() => {
    if (hasRun.current || isFetching || !actor) return;
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
        const clientId = await actor.getXClientId();
        console.log(
          "[OAuth] Fetched client ID from backend:",
          clientId ?? "(none)"
        );
        if (!clientId) {
          throw new Error(
            "No X Client ID configured. Please set it in Settings first."
          );
        }
        console.log("[OAuth] Calling completeOAuth on backend...");
        const result = await actor.completeOAuth(code, state);
        if (result.__kind__ === "ok") {
          console.log("[OAuth] Success:", result.ok);
          setStatus("success");
          setTimeout(() => {
            navigate({ to: "/settings" });
          }, 2e3);
        } else {
          const errMsg = result.__kind__ === "err" ? result.err : "Unknown error";
          console.log("[OAuth] Error from backend:", errMsg);
          setErrorMessage(errMsg);
          setStatus("error");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unexpected error during OAuth";
        console.log("[OAuth] Exception:", msg);
        setErrorMessage(msg);
        setStatus("error");
      }
    }
    handleCallback();
  }, [actor, isFetching, code, state, oauthError, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16",
      "data-ocid": "oauth_callback.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute inset-0 pointer-events-none overflow-hidden",
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { duration: 0.4 },
              className: "flex justify-center mb-8",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center shadow-lifted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "w-8 h-8 text-background", strokeWidth: 1.5 }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
            status === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -12 },
                transition: { duration: 0.3 },
                className: "text-center",
                "data-ocid": "oauth_callback.loading_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-10 h-10 text-primary animate-spin" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Connecting Twitter" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Completing your Twitter/X authorization…" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 card-warm p-4 text-left space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Step,
                      {
                        done: false,
                        active: true,
                        label: "Verifying callback parameters"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Step,
                      {
                        done: false,
                        active: false,
                        label: "Fetching stored Client ID"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Step, { done: false, active: false, label: "Exchanging tokens" })
                  ] })
                ]
              },
              "loading"
            ),
            status === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                transition: { type: "spring", duration: 0.5 },
                className: "text-center",
                "data-ocid": "oauth_callback.success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      initial: { scale: 0 },
                      animate: { scale: 1 },
                      transition: { type: "spring", delay: 0.1 },
                      className: "flex justify-center mb-5",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CircleCheckBig,
                        {
                          className: "w-9 h-9 text-primary",
                          strokeWidth: 1.5
                        }
                      ) })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Twitter Connected!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Your Solemar account is now linked to Twitter/X. Bookings will be announced automatically." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-accent/20 border border-accent/30 rounded-xl px-5 py-4 text-sm text-foreground/80", children: "🌊 Redirecting you to Settings in a moment…" })
                ]
              },
              "success"
            ),
            status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                transition: { type: "spring", duration: 0.5 },
                className: "text-center",
                "data-ocid": "oauth_callback.error_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      initial: { scale: 0 },
                      animate: { scale: 1 },
                      transition: { type: "spring", delay: 0.1 },
                      className: "flex justify-center mb-5",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CircleX,
                        {
                          className: "w-9 h-9 text-destructive",
                          strokeWidth: 1.5
                        }
                      ) })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Connection Failed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "We couldn't complete the Twitter authorization." }),
                  errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3 mb-6 text-sm text-destructive text-left break-words", children: errorMessage }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        onClick: () => navigate({ to: "/settings" }),
                        className: "gap-2 transition-smooth",
                        "data-ocid": "oauth_callback.goto_settings_button",
                        children: "Go to Settings"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        onClick: () => navigate({ to: "/settings" }),
                        className: "gap-2 transition-smooth",
                        "data-ocid": "oauth_callback.retry_button",
                        children: "Retry in Settings"
                      }
                    )
                  ] })
                ]
              },
              "error"
            )
          ] })
        ] })
      ]
    }
  );
}
function Step({ done, active, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
    done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-primary flex-shrink-0" }) : active ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 text-primary animate-spin flex-shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: active ? "text-foreground font-medium" : "text-muted-foreground",
        children: label
      }
    )
  ] });
}
export {
  OAuthCallback as default
};
