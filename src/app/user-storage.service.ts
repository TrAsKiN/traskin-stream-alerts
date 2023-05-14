import { Injectable } from '@angular/core';
import { User } from './auth.service';

export const USER_TOKEN_KEY = 'user';

export type UserToken = string;

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  private user?: User;

  get token() {
    return this.user?.token;
  }

  store(token: UserToken) {
    this.user = { token };
    window.localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(this.user));
  }

  remove() {
    window.localStorage.removeItem(USER_TOKEN_KEY);
  }

  clear() {
    window.localStorage.clear();
  }

  constructor() {
    const storageData = window.localStorage.getItem(USER_TOKEN_KEY);
    if (storageData) {
      this.user = JSON.parse(storageData) as User;
    }
  }
}
