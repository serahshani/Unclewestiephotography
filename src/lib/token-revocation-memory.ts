const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

type RevokedStore = Map<string, number>;

function getStore(): RevokedStore {
  const globalRef = globalThis as typeof globalThis & {
    __revokedTokens?: RevokedStore;
  };
  if (!globalRef.__revokedTokens) {
    globalRef.__revokedTokens = new Map();
  }
  return globalRef.__revokedTokens;
}

function pruneStore(store: RevokedStore) {
  const now = Date.now();
  for (const [jti, expiresAt] of store.entries()) {
    if (now > expiresAt) store.delete(jti);
  }
}

export function revokeTokenInMemory(jti: string, expiresAtMs?: number): void {
  const expiresAt = expiresAtMs ?? Date.now() + TOKEN_TTL_MS;
  const store = getStore();
  store.set(jti, expiresAt);
  pruneStore(store);
}

export function isTokenRevokedInMemory(jti: string): boolean {
  const store = getStore();
  const expiresAt = store.get(jti);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    store.delete(jti);
    return false;
  }
  return true;
}
