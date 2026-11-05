type AttemptRecord = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, AttemptRecord>();

export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
) {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now >= record.resetAt) {
    attempts.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      remaining: maxAttempts - 1,
      retryAfter: 0,
    };
  }

  if (record.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count++;

  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    retryAfter: 0,
  };
}