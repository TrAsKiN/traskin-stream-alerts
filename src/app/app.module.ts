import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnectComponent } from './connect/connect.component';
import { DashboardComponent } from './dashboard.component';
import { NotFoundComponent } from './not-found.component';
import { FollowersComponent } from './panels/followers/followers.component';
import { PanelSettingsComponent } from './panels/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectComponent,
    DashboardComponent,
    NotFoundComponent,
    PanelSettingsComponent,
    FollowersComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    AppRoutingModule,
    MatExpansionModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
