import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { UserStorageService } from '../../user-storage.service';

@Component({
  selector: 'tsa-panel-settings',
  templateUrl: './settings.component.html',
})
export class PanelSettingsComponent {
  constructor(
    private router: Router,
    private auth: AuthService,
    private storage: UserStorageService
  ) {}

  onDisconnect() {
    this.auth.logout();
  }

  onClear() {
    this.storage.clear();
    this.router.navigateByUrl('/login');
  }
}
