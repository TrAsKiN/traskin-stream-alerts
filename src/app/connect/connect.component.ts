import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Api, Chat, EventSub } from '@traskin/twitch-tools-js';

import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'tsa-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss'],
})
export class ConnectComponent implements OnInit {
  authUrl = Api.generateAuthUrl(environment.clientId, [
    ...new Set([...Chat.getScopes(), ...EventSub.getScopes()]),
  ]);

  constructor(private route: ActivatedRoute, private auth: AuthService) {}

  ngOnInit() {
    const userToken = this.route.snapshot.fragment
      ?.match(/access_token=(\w+)/)
      ?.slice(1)
      .shift();

    if (userToken) {
      this.auth.login({ token: userToken });
    }
  }
}
