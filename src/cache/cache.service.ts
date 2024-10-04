export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, ttl: number): Promise<void>;
}

export const CACHE_SERVICE_TOKEN = Symbol('CACHE_SERVICE_TOKEN');
