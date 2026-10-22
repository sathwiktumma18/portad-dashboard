"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { User } from "firebase/auth";

import { firebaseEnabled, getFirebaseApi } from "@/lib/firebase";

export type AuthSession = {
  email: string;
  uid: string | null;
  provider: string;
  mode: "firebase" | "preview";
  since: string;
  expiresAt: string | null;
  token: string | null;
};

export type AuthState = {
  ready: boolean;
  session: AuthSession | null;
};

const PREVIEW_KEY = "portad.stub-session";

let state: AuthState = { ready: false, session: null };
let lastRaw: string | null = null;
const listeners = new Set<() => void>();

let started = false;
let firebaseBound = false;
let tokenSeq = 0;
let firebaseSession: AuthSession | null = null;
let previewSession: AuthSession | null = null;

function emit(): void {
  const ready = !firebaseEnabled || firebaseBound;
  const session = firebaseSession ?? previewSession;
  const raw = JSON.stringify({ ready, session });
  if (raw === lastRaw) return;
  lastRaw = raw;
  state = { ready, session };
  listeners.forEach((listener) => listener());
}

function readPreview(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PREVIEW_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { email?: string; since?: string };
    if (!parsed || typeof parsed.email !== "string") return null;
    return {
      email: parsed.email,
      uid: null,
      provider: "preview",
      mode: "preview",
      since: typeof parsed.since === "string" ? parsed.since : new Date().toISOString(),
      expiresAt: null,
      token: null,
    };
  } catch {
    return null;
  }
}

function clearPreviewStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PREVIEW_KEY);
  previewSession = null;
}

function provisionalSession(user: User): AuthSession {
  return {
    email: user.email ?? "unknown",
    uid: user.uid,
    provider: user.providerData[0]?.providerId ?? "password",
    mode: "firebase",
    since: user.metadata.lastSignInTime ?? new Date().toISOString(),
    expiresAt: null,
    token: null,
  };
}

async function fullSession(user: User): Promise<AuthSession> {
  const base = provisionalSession(user);
  try {
    const result = await user.getIdTokenResult();
    return {
      ...base,
      since: result.authTime || base.since,
      expiresAt: result.expirationTime ?? null,
      token: result.token,
    };
  } catch {
    return base;
  }
}

function ensureStarted(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  previewSession = readPreview();
  window.addEventListener("storage", (event) => {
    if (event.key === null || event.key === PREVIEW_KEY) {
      previewSession = readPreview();
      emit();
    }
  });
  emit();

  if (!firebaseEnabled) return;

  const apiPromise = getFirebaseApi();
  if (!apiPromise) return;

  apiPromise
    .then(({ auth, onIdTokenChanged }) => {
      onIdTokenChanged(auth, (user) => {
        const seq = ++tokenSeq;
        if (!user) {
          firebaseSession = null;
          firebaseBound = true;
          emit();
          return;
        }
        firebaseSession = provisionalSession(user);
        firebaseBound = true;
        emit();
        void fullSession(user).then((session) => {
          if (seq !== tokenSeq) return;
          firebaseSession = session;
          emit();
        });
      });
    })
    .catch(() => {
      firebaseBound = true;
      emit();
    });
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot(): AuthState {
  return state;
}

const SERVER_SNAPSHOT: AuthState = {
  ready: false,
  session: null,
};

function getServerSnapshot(): AuthState {
  return SERVER_SNAPSHOT;
}

export function useAuth(): AuthState {
  const authState = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    ensureStarted();
  }, []);
  return authState;
}

async function withApi<T>(
  run: (api: NonNullable<Awaited<ReturnType<typeof getFirebaseApi>>>) => Promise<T>,
): Promise<T> {
  const apiPromise = getFirebaseApi();
  if (!apiPromise) throw new Error("firebase-not-configured");
  return run(await apiPromise);
}

export async function signInEmail(email: string, password: string): Promise<void> {
  await withApi(({ auth, signInWithEmailAndPassword }) =>
    signInWithEmailAndPassword(auth, email, password),
  );
  clearPreviewStorage();
}

export async function signUpEmail(email: string, password: string): Promise<void> {
  await withApi(({ auth, createUserWithEmailAndPassword }) =>
    createUserWithEmailAndPassword(auth, email, password),
  );
  clearPreviewStorage();
}

export async function signInWithGitHub(): Promise<void> {
  await withApi(({ auth, signInWithPopup, GithubAuthProvider }) =>
    signInWithPopup(auth, new GithubAuthProvider()),
  );
  clearPreviewStorage();
}

export async function signInWithGoogle(): Promise<void> {
  await withApi(({ auth, signInWithPopup, GoogleAuthProvider }) =>
    signInWithPopup(auth, new GoogleAuthProvider()),
  );
  clearPreviewStorage();
}

export function signInPreview(): void {
  const session = {
    email: "preview@portad.local",
    since: new Date().toISOString(),
  };
  window.localStorage.setItem(PREVIEW_KEY, JSON.stringify(session));
  previewSession = readPreview();
  emit();
}

export async function signOut(): Promise<void> {
  clearPreviewStorage();
  const apiPromise = getFirebaseApi();
  if (apiPromise) {
    try {
      const { auth, signOut: firebaseSignOut } = await apiPromise;
      await firebaseSignOut(auth);
    } catch {
      // Firebase may not be reachable; local state is already cleared.
    }
  }
  emit();
}

export async function getAuthToken(): Promise<string | null> {
  const apiPromise = getFirebaseApi();
  if (!apiPromise) return null;
  try {
    const { auth } = await apiPromise;
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  } catch {
    return null;
  }
}

export async function authFetch(
  input: string | Request,
  init?: RequestInit,
): Promise<Response> {
  const token = await getAuthToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

export function friendlyAuthError(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Wrong email or password.";
    case "auth/email-already-in-use":
      return "This email is already registered — try signing in.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before finishing.";
    case "auth/popup-blocked":
      return "Popup blocked — allow popups for this site and retry.";
    case "auth/operation-not-allowed":
    case "auth/configuration-not-found":
      return "This sign-in method isn't enabled yet in the Firebase project.";
    case "auth/network-request-failed":
      return "Network error — check your connection and retry.";
    case "firebase-not-configured":
      return "Firebase isn't configured yet — using preview mode.";
    default:
      return "Sign-in failed — please try again.";
  }
}
