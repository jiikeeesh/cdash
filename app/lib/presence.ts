// Real-time user presence tracking in memory
const globalForPresence = globalThis as unknown as {
  userHeartbeats: Map<string, number>;
};

if (!globalForPresence.userHeartbeats) {
  globalForPresence.userHeartbeats = new Map<string, number>();
}

const ONLINE_THRESHOLD_MS = 45 * 1000; // 45 seconds

export function touchPresence(userId: string) {
  if (!userId) return;
  globalForPresence.userHeartbeats.set(userId, Date.now());
}

export function removePresence(userId: string) {
  if (!userId) return;
  globalForPresence.userHeartbeats.delete(userId);
}

export function isUserOnline(userId: string): boolean {
  if (!userId) return false;
  const ts = globalForPresence.userHeartbeats.get(userId);
  if (!ts) return false;
  return Date.now() - ts <= ONLINE_THRESHOLD_MS;
}

export function getLastActive(userId: string): number | null {
  if (!userId) return null;
  return globalForPresence.userHeartbeats.get(userId) ?? null;
}

export function getAllPresenceMap(): Record<string, { isOnline: boolean; lastActive: number | null }> {
  const result: Record<string, { isOnline: boolean; lastActive: number | null }> = {};
  const now = Date.now();
  for (const [userId, ts] of globalForPresence.userHeartbeats.entries()) {
    result[userId] = {
      isOnline: now - ts <= ONLINE_THRESHOLD_MS,
      lastActive: ts,
    };
  }
  return result;
}
