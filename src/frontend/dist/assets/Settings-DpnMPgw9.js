var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentResult, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn, _a;
import { S as Subscribable, s as shallowEqualObjects, h as hashKey, g as getDefaultState, n as notifyManager, e as useQueryClient, r as reactExports, f as noop, i as shouldThrowError, c as createLucideIcon, j as jsxRuntimeExports, k as cn, l as useIsAdmin, u as useBackend, m as useQuery } from "./index-DfOCFdc_.js";
import { B as Badge } from "./badge-DFHurYdh.js";
import { B as Button } from "./button-DjKzj_bo.js";
import { P as Primitive, L as Label, I as Input, u as ue } from "./index-D0PKKU4J.js";
import { C as CircleX } from "./circle-x-_wdLdZ8g.js";
import { L as LoaderCircle } from "./loader-circle-MBV8gwbk.js";
import { T as Twitter } from "./twitter-O041gv87.js";
var MutationObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client).getMutationCache().build(__privateGet(this, _client), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client = new WeakMap(), _currentResult = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn = function(action) {
  notifyManager.batch(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult).variables;
      const onMutateResult = __privateGet(this, _currentResult).context;
      const context = {
        client: __privateGet(this, _client),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult));
    });
  });
}, _a);
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
];
const KeyRound = createLucideIcon("key-round", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode);
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function AccessDenied() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4",
      "data-ocid": "settings.access_denied",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-14 h-14 text-destructive/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold text-foreground", children: "Access Denied" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm", children: "This page is restricted to administrators only. Please log in with an admin account to continue." })
      ]
    }
  );
}
function SettingsSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6 animate-pulse", "data-ocid": "settings.loading_state", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-warm p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-48 bg-muted rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-80 bg-muted rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-full bg-muted rounded" })
  ] }, i)) });
}
function ClientIdSection() {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [value, setValue] = reactExports.useState("");
  const [showValue, setShowValue] = reactExports.useState(false);
  const { data: currentClientId, isLoading: isLoadingId } = useQuery({
    queryKey: ["xClientId"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getXClientId();
    },
    enabled: !!actor && !isFetching
  });
  reactExports.useEffect(() => {
    if (currentClientId) setValue("");
  }, [currentClientId]);
  const saveMutation = useMutation({
    mutationFn: async (clientId) => {
      if (!actor) throw new Error("Not connected");
      await actor.setXClientId(clientId);
    },
    onSuccess: () => {
      ue.success("Client ID saved successfully.");
      queryClient.invalidateQueries({ queryKey: ["xClientId"] });
    },
    onError: (err) => {
      ue.error(`Failed to save Client ID: ${err.message}`);
    }
  });
  const isSaved = !!currentClientId;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "card-warm p-6 space-y-5",
      "data-ocid": "settings.client_id.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "w-5 h-5 mt-0.5 text-primary flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground", children: "OAuth 2.0 Client ID for X" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Single global value used for the PKCE OAuth flow. Obtained from the X Developer Portal." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Status:" }),
          isLoadingId ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              "data-ocid": "settings.client_id.loading_state",
              children: "Checking…"
            }
          ) : isSaved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              className: "bg-primary/15 text-primary border-primary/30",
              "data-ocid": "settings.client_id.success_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1" }),
                " Saved"
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "bg-accent/30 text-foreground border-accent/40",
              "data-ocid": "settings.client_id.error_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3 mr-1" }),
                " Not set"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "client-id", className: "text-sm font-medium", children: currentClientId ? "Update Client ID" : "Client ID" }),
          currentClientId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-md bg-muted border border-border font-mono text-sm text-muted-foreground select-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 tracking-widest", children: showValue ? currentClientId : `${"•".repeat(Math.min(currentClientId.length, 24))}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": showValue ? "Hide Client ID" : "Show Client ID",
                onClick: () => setShowValue((v) => !v),
                className: "text-muted-foreground hover:text-foreground transition-colors",
                "data-ocid": "settings.client_id.toggle",
                children: showValue ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "client-id",
                "data-ocid": "settings.client_id.input",
                type: "text",
                placeholder: currentClientId ? "Enter new Client ID to replace…" : "Enter your X OAuth 2.0 Client ID",
                value,
                onChange: (e) => setValue(e.target.value),
                className: "font-mono text-sm"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "settings.client_id.save_button",
                onClick: () => saveMutation.mutate(value.trim()),
                disabled: !value.trim() || saveMutation.isPending,
                children: [
                  saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : null,
                  "Save"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function TwitterConnectionSection() {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const {
    data: twitterStatus,
    isLoading: isLoadingStatus,
    error: statusError
  } = useQuery({
    queryKey: ["twitterStatus"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTwitterStatus();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true
  });
  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const params = await actor.getOAuthStartParams(
        `${window.location.origin}/oauth-callback`
      );
      sessionStorage.setItem("oauth_state", params.state);
      sessionStorage.setItem("oauth_code_verifier", params.codeVerifier);
      window.location.href = params.authUrl;
    },
    onError: (err) => {
      ue.error(`Could not start OAuth flow: ${err.message}`);
    }
  });
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.disconnectTwitter();
    },
    onSuccess: () => {
      ue.success("Twitter / X disconnected.");
      queryClient.invalidateQueries({ queryKey: ["twitterStatus"] });
    },
    onError: (err) => {
      ue.error(`Failed to disconnect: ${err.message}`);
    }
  });
  const isConnected = (twitterStatus == null ? void 0 : twitterStatus.connected) ?? false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "card-warm p-6 space-y-5",
      "data-ocid": "settings.twitter.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "w-5 h-5 mt-0.5 text-primary flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground", children: "Twitter / X Connection" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Authorize Solemar to post tweets automatically when a new booking is received." })
          ] })
        ] }),
        isLoadingStatus ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 text-sm text-muted-foreground",
            "data-ocid": "settings.twitter.loading_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
              "Checking connection status…"
            ]
          }
        ) : statusError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2",
            "data-ocid": "settings.twitter.error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 flex-shrink-0" }),
              "Could not load connection status."
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Status:" }),
          isConnected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              className: "bg-primary/15 text-primary border-primary/30",
              "data-ocid": "settings.twitter.success_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1" }),
                "Connected",
                (twitterStatus == null ? void 0 : twitterStatus.username) ? ` · @${twitterStatus.username}` : ""
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "bg-accent/30 text-foreground border-accent/40",
              "data-ocid": "settings.twitter.disconnected_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3 mr-1" }),
                "Not connected"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3", children: !isConnected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "settings.twitter.connect_button",
            onClick: () => connectMutation.mutate(),
            disabled: connectMutation.isPending || isLoadingStatus,
            className: "bg-primary text-primary-foreground hover:bg-primary/90",
            children: [
              connectMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "w-4 h-4 mr-2" }),
              "Connect X / Twitter"
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "destructive",
            "data-ocid": "settings.twitter.disconnect_button",
            onClick: () => disconnectMutation.mutate(),
            disabled: disconnectMutation.isPending,
            children: [
              disconnectMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 mr-2" }),
              "Disconnect X / Twitter"
            ]
          }
        ) })
      ]
    }
  );
}
function Settings() {
  const { isAdmin, isLoading } = useIsAdmin();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsSkeleton, {});
  if (!isAdmin) return /* @__PURE__ */ jsxRuntimeExports.jsx(AccessDenied, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "main",
    {
      className: "container mx-auto px-4 py-12 max-w-2xl space-y-8",
      "data-ocid": "settings.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground", children: "Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Manage your Twitter / X integration and OAuth credentials." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClientIdSection, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TwitterConnectionSection, {})
      ]
    }
  );
}
export {
  Settings as default
};
