import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const enabled = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
const redis = enabled ? Redis.fromEnv() : null;

function make(prefix: string, tokens: number, window: `${number} ${'s' | 'm' | 'h'}`) {
  if (!redis) return null;
  return new Ratelimit({ redis, prefix: `rl:${prefix}`, limiter: Ratelimit.slidingWindow(tokens, window) });
}

const limiters = {
  reader: make('reader', 60, '1 m'),
  profiles: make('profiles', 10, '1 h'),
  downloads: make('downloads', 30, '1 h'),
  admin: make('admin', 300, '1 m'),
};

export async function checkLimit(name: keyof typeof limiters, key: string): Promise<boolean> {
  const limiter = limiters[name];
  if (!limiter) return true;
  const { success } = await limiter.limit(key);
  return success;
}
