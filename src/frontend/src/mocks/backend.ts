import type { backendInterface } from "../backend";
import { UserRole } from "../backend";

export const mockBackend: backendInterface = {
  _initializeAccessControl: async () => undefined,
  assignCallerUserRole: async (_user, _role) => undefined,
  completeOAuth: async (_code, _state) => ({ __kind__: "ok", ok: "OAuth completed successfully" }),
  createBooking: async (_checkIn, _checkOut, _guestCount, _name, _email) => "SOL-A3F7X2",
  disconnectTwitter: async () => undefined,
  getCallerUserRole: async () => UserRole.guest,
  getOAuthStartParams: async (_redirectUri) => ({
    state: "mock-state-123",
    codeVerifier: "mock-code-verifier-abc",
    authUrl: "https://twitter.com/i/oauth2/authorize?mock=true",
  }),
  getTwitterStatus: async () => ({
    username: undefined,
    connected: false,
  }),
  getXClientId: async () => null,
  http_request: async (_req) => ({
    body: new Uint8Array([]),
    headers: [],
    upgrade: false,
    status_code: 200,
  }),
  isCallerAdmin: async () => false,
  isCallerAdminUpdate: async () => false,
  setXClientId: async (_clientId) => undefined,
  forceSetAdmin: (_p) => Promise.resolve(undefined),
};
