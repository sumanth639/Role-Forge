const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20; // per user per minute

const userRequests = new Map<
  string,
  { count: number; windowStart: number }
>();

export function checkRateLimit(userId: string) {
  const now = Date.now();
  const record = userRequests.get(userId);

  if (!record || now - record.windowStart > WINDOW_MS) {
    userRequests.set(userId, { count: 1, windowStart: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}
