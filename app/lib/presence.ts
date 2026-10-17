// Real-time user presence tracking in memory
export type UserPresenceStatus = 'active' | 'away' | 'busy' | 'dnd' | 'ooo';

const globalForPresence = globalThis as unknown as {
  userHeartbeats: Map<string, number>;
  userStatuses: Map<string, UserPresenceStatus>;
};

if (!globalForPresence.userHeartbeats) {
  globalForPresence.userHeartbeats = new Map<string, number>();
}
if (!globalForPresence.userStatuses) {
  globalForPresence.userStatuses = new Map<string, UserPresenceStatus>();
}

const ONLINE_THRESHOLD_MS = 45 * 1000; // 45 seconds

export function touchPresence(userId: string, status?: UserPresenceStatus) {
  if (!userId) return;
  globalForPresence.userHeartbeats.set(userId, Date.now());
  if (status) {
    globalForPresence.userStatuses.set(userId, status);
  }
}

export function setUserStatus(userId: string, status: UserPresenceStatus) {
  if (!userId) return;
  globalForPresence.userStatuses.set(userId, status);
  globalForPresence.userHeartbeats.set(userId, Date.now());
}

export function getUserStatus(userId: string): UserPresenceStatus {
  if (!userId) return 'active';
  return globalForPresence.userStatuses.get(userId) || 'active';
}

export function removePresence(userId: string) {
  if (!userId) return;
  globalForPresence.userHeartbeats.delete(userId);
  globalForPresence.userStatuses.delete(userId);
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

export function getAllPresenceMap(): Record<string, { isOnline: boolean; lastActive: number | null; status: UserPresenceStatus }> {
  const result: Record<string, { isOnline: boolean; lastActive: number | null; status: UserPresenceStatus }> = {};
  const now = Date.now();
  for (const [userId, ts] of globalForPresence.userHeartbeats.entries()) {
    const online = now - ts <= ONLINE_THRESHOLD_MS;
    result[userId] = {
      isOnline: online,
      lastActive: ts,
      status: online ? (globalForPresence.userStatuses.get(userId) || 'active') : 'active',
    };
  }
  return result;
}

