const ACCESS_TOKEN_KEY = "asc:accessToken";
const REFRESH_TOKEN_KEY = "asc:refreshToken";
const EXPIRES_AT_KEY = "asc:tokenExpiresAt";

type TokenPayload = {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: number;
  remember?: boolean;
};

const noopStorage: Storage = {
  length: 0,
  clear: () => undefined,
  getItem: () => null,
  key: () => null,
  removeItem: () => undefined,
  setItem: () => undefined,
};

const getStorage = (persist?: boolean): Storage => {
  if (typeof window === "undefined") return noopStorage;
  return persist ? window.localStorage : window.sessionStorage;
};

const write = (key: string, value: string | null, persist?: boolean) => {
  const storage = getStorage(persist);
  if (value === null || value === undefined) {
    storage.removeItem(key);
  } else {
    storage.setItem(key, value);
  }
};

const read = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
};

export const tokenManager = {
  saveTokens({ accessToken, refreshToken, expiresAt, remember }: TokenPayload) {
    write(ACCESS_TOKEN_KEY, accessToken, remember);
    write(REFRESH_TOKEN_KEY, refreshToken ?? null, remember);
    write(EXPIRES_AT_KEY, expiresAt ? String(expiresAt) : null, remember);
  },

  clearTokens() {
    write(ACCESS_TOKEN_KEY, null);
    write(REFRESH_TOKEN_KEY, null);
    write(EXPIRES_AT_KEY, null);
  },

  getAccessToken() {
    return read(ACCESS_TOKEN_KEY);
  },

  getRefreshToken() {
    return read(REFRESH_TOKEN_KEY);
  },

  getExpiresAt() {
    const value = read(EXPIRES_AT_KEY);
    return value ? Number(value) : undefined;
  },

  isTokenExpired(offsetSeconds = 60) {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return false;
    const now = Date.now();
    return expiresAt - offsetSeconds * 1000 < now;
  },
};
