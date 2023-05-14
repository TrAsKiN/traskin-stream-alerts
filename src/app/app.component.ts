import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      main {
        margin: 0.5rem;
      }
    `,
  ],
})
export class AppComponent {}
