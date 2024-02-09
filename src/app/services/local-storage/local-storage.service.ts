import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly prefix = 'app_';
  setWithExpiration(key: string, value: any, ttlInDays: number): void {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + ttlInDays * 24 * 60 * 60 * 1000);

    const item = {
      value: JSON.stringify(value),
      expirationDate: expirationDate.toISOString()
    };

    localStorage.setItem(this.prefix + key, JSON.stringify(item));
  }

  getWithExpiration(key: string): any {
    const item = localStorage.getItem(this.prefix + key);

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
    localStorage.removeItem(this.prefix + key);
  }
}
