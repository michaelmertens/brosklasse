import { Injectable } from '@angular/core';

export type AdminUser = string;

@Injectable()
export class AuthService {

  // Fool anyone?
  private nameKey: string = 'admin_user';
  private adminKey: string = 'cookie';
  private adminValue: string = 'AAMclT7uyaxbN4aA8';

  constructor() { }

  makeAdmin() {
    return localStorage.setItem(this.adminKey, this.adminValue);
  }

  isAdmin(): boolean {
    return localStorage.getItem(this.adminKey) === this.adminValue;
  }

  getAdminUser(): AdminUser {
    return localStorage.getItem(this.nameKey);
  }

  saveAdminUser(user: AdminUser) {
    localStorage.setItem(this.nameKey, user);
  }
}
