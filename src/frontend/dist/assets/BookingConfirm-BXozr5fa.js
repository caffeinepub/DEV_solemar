import { b as useRouterState, c as createLucideIcon, a as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-CB4mwlHl.js";
import { B as Badge } from "./badge-CZe6xC3r.js";
import { B as Button } from "./button-CZ28GUuK.js";
import { m as motion } from "./proxy-9AKmC6Xt.js";
import { C as CircleCheckBig } from "./circle-check-big-YE6hDDnI.js";
import { C as Calendar, U as Users } from "./users-BY9Aq398.js";
import { T as Twitter } from "./twitter-BQAmsMx-.js";
function useLocation(opts) {
  return useRouterState({
    select: (state) => state.location
  });
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode);
function formatDate(dateStr) {
  const d = /* @__PURE__ */ new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function nightsBetween(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  return Math.max(
    1,
    Math.round((b.getTime() - a.getTime()) / (1e3 * 60 * 60 * 24))
  );
}
function BookingConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state ?? {};
  const {
    referenceCode = "SOL-000000",
    checkIn = "",
    checkOut = "",
    guestCount = 1,
    name = "Guest",
    tweetPosted,
    tweetError
  } = state;
  reactExports.useEffect(() => {
    if (tweetPosted !== void 0 || tweetError !== void 0) {
      if (tweetPosted) {
        console.log("[Tweet] Posted successfully for booking", referenceCode);
      } else if (tweetError) {
        console.log("[Tweet] Failed to post:", tweetError);
      }
    }
  }, [referenceCode, tweetPosted, tweetError]);
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16",
      "data-ocid": "booking_confirm.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute inset-0 pointer-events-none overflow-hidden",
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { type: "spring", duration: 0.6 },
              className: "flex justify-center mb-6",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-ambient", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-10 h-10 text-primary", strokeWidth: 1.5 }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.15 },
              className: "text-center mb-8",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-bold text-foreground mb-2", children: "Booking Confirmed!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-lg", children: [
                  "Welcome,",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: name }),
                  ". Your seaside escape awaits."
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.25 },
              className: "bg-primary text-primary-foreground rounded-2xl px-8 py-6 text-center mb-6 shadow-lifted",
              "data-ocid": "booking_confirm.reference_card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-widest opacity-80 mb-2 font-body", children: "Booking Reference" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-4xl md:text-5xl font-bold tracking-wider", children: referenceCode }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-70 mt-2 font-body", children: "Keep this code for your records" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.35 },
              className: "card-warm p-6 mb-6 space-y-4",
              "data-ocid": "booking_confirm.details_card",
              children: [
                checkIn && checkOut && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Calendar,
                    {
                      className: "w-5 h-5 text-secondary",
                      strokeWidth: 1.5
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-0.5", children: "Dates" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm", children: [
                      formatDate(checkIn),
                      " → ",
                      formatDate(checkOut)
                    ] }),
                    nights > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                      nights,
                      " ",
                      nights === 1 ? "night" : "nights"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-secondary", strokeWidth: 1.5 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-0.5", children: "Guests" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm", children: [
                      guestCount,
                      " ",
                      guestCount === 1 ? "guest" : "guests"
                    ] })
                  ] })
                ] })
              ]
            }
          ),
          (tweetPosted !== void 0 || tweetError !== void 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.45 },
              className: "mb-6",
              "data-ocid": "booking_confirm.tweet_status",
              children: tweetPosted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-center text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Your arrival has been shared on Twitter/X 🌊" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "Posted" })
              ] }) : tweetError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-center text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "w-4 h-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Tweet not posted" })
              ] }) : null
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.5 },
              className: "bg-accent/20 border border-accent/30 rounded-xl px-5 py-4 mb-8 text-center",
              "data-ocid": "booking_confirm.info_note",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80", children: "🏖️ A confirmation has been noted. You'll find us at Muro Alto, PE, Brasil — arrive to the sound of waves." })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.55 },
              className: "flex justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "lg",
                  onClick: () => navigate({ to: "/" }),
                  className: "gap-2 transition-smooth hover:bg-primary hover:text-primary-foreground hover:border-primary",
                  "data-ocid": "booking_confirm.back_home_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                    "Back to home"
                  ]
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
export {
  BookingConfirm as default
};
