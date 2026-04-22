import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HttpRequest {
    url: string;
    method: string;
    body: Uint8Array;
    headers: Array<[string, string]>;
}
export type Result = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface TwitterStatus {
    username?: string;
    connected: boolean;
}
export interface OAuthStartParams {
    state: string;
    codeVerifier: string;
    authUrl: string;
}
export interface HttpResponse {
    body: Uint8Array;
    headers: Array<[string, string]>;
    upgrade?: boolean;
    status_code: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeOAuth(code: string, state: string): Promise<Result>;
    createBooking(checkIn: string, checkOut: string, guestCount: bigint, name: string, email: string): Promise<string>;
    disconnectTwitter(): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getOAuthStartParams(redirectUri: string): Promise<OAuthStartParams>;
    getTwitterStatus(): Promise<TwitterStatus>;
    getXClientId(): Promise<string | null>;
    http_request(_req: HttpRequest): Promise<HttpResponse>;
    isCallerAdmin(): Promise<boolean>;
    setXClientId(clientId: string): Promise<void>;
}
