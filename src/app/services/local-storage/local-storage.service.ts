import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly prefix = 'app_';
  private storageLocal: Storage = localStorage;
  setWithExpiration(key: string, value: any, ttlInDays: number): void {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + ttlInDays * 24 * 60 * 60 * 1000);

    const item = {
      value: JSON.stringify(value),
      expirationDate: expirationDate.toISOString()
    };

    this.storageLocal.setItem(this.prefix + key, JSON.stringify(item));
  }

  getWithExpiration(key: string): any {
    const item = this.storageLocal.getItem(this.prefix + key);

    if (!item) {
      return null;
    }

    const parsedItem = JSON.parse(item);

    if (new Date(parsedItem.expirationDate) > new Date()) {
      return JSON.parse(parsedItem.value);
    } else {
      this.remove(key);
      return null;
    }
  }

  remove(key: string): void {
    this.storageLocal.removeItem(this.prefix + key);
  }
}
