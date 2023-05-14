import { Component } from '@angular/core';

@Component({
  selector: 'tsa-dashboard',
  template: `
    <mat-accordion multi>
      <tsa-panel-followers class="panel"></tsa-panel-followers>
      <tsa-panel-settings class="panel"></tsa-panel-settings>
    </mat-accordion>
  `,
})
export class DashboardComponent {}
