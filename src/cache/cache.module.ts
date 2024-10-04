import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { CACHE_SERVICE_TOKEN } from './cache.service';

@Module({
  providers: [{ provide: CACHE_SERVICE_TOKEN, useClass: RedisCacheService }],
  exports: [CACHE_SERVICE_TOKEN],
})
export class CacheModule {}
