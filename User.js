'use strict';

class User {
    id;
    name;
    token;
    clientId;
    totalFollowers;
    lastFollower;
    waiting = false;

    constructor(token, clientId) {
        this.token = token;
        this.clientId = clientId;
    }

    getUser() {
        return new Promise((resolve, reject) => {
            this.httpRequest('https://api.twitch.tv/helix/users')
            .then((response) => {
                this.id = response.data[0].id;
                this.name = response.data[0].display_name;
                resolve(response);
            })
            .catch((response) => {
                reject(response);
            });
        });
    }
    getLastFollow() {
        return new Promise((resolve, reject) => {
            if (!this.waiting) {
                this.waiting = true;
                this.httpRequest('https://api.twitch.tv/helix/users/follows?first=1&to_id=' + this.id)
                .then((response) => {
                    this.waiting = false;
                    this.totalFollowers = response.total;
                    this.lastFollower = response.data[0].from_name;
                    resolve(response);
                })
                .catch((response) => {
                    this.waiting = false;
                    reject(response);
                });
            } else {
                reject(false);
            }
        });
    }

    httpRequest(url) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === XMLHttpRequest.DONE) {
                    switch (request.status) {
                        case 200:
                            resolve(JSON.parse(request.response));
                            break;
                        default:
                            reject(JSON.parse(request.response));
                    }
                }
            };
            request.onerror = () => {
                reject(request.statusText);
            };
            request.open('GET', url, true);
            request.setRequestHeader('Client-ID', this.clientId);
            request.setRequestHeader('Authorization', 'Bearer ' + this.token);
            request.send();
        });
    }
};
