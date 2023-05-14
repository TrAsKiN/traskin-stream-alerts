import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserStorageService, UserToken } from './user-storage.service';

export type User = {
  username?: string;
  token?: UserToken;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authStatus$ = new BehaviorSubject(false);

  constructor(private storage: UserStorageService, private router: Router) {
    if (storage.token) {
      this.authStatus$.next(true);
    }
  }

  login(user: User) {
    if (!user.token) {
      return;
    }

    this.storage.store(user.token);
    this.authStatus$.next(true);
    this.router.navigateByUrl('/dashboard');
  }

  logout() {
    this.storage.remove();
    this.authStatus$.next(false);
    this.router.navigateByUrl('/login');
  }
}
