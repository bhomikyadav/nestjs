import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class RequestContextService {
  protected readonly als = new AsyncLocalStorage<Map<string, any>>();

  run<T>(callback: () => T): T {
    return this.als.run(new Map<string, any>(), callback);
  }

  getStore() {
    return this.als.getStore();
  }
  get<T>(key: string): T | undefined {
    return this.als.getStore()?.get(key);
  }

  set(key: string, value: any) {
    const store = this.als.getStore();
    if (store) {
      store.set(key, value);
    }
  }
}
