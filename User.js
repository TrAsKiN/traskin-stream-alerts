'use strict';

class User {
    id;
    name;
    token;
    totalFollows;
    lastFollower;

    constructor(token) {
        this.token = token;
    }

    getUser(callback) {
        this.httpRequest('https://api.twitch.tv/helix/users', (response) => {
            this.id = response.data[0].id;
            this.name = response.data[0].display_name;
            callback();
        });
    }
    getLastFollow(callback) {
        this.httpRequest('https://api.twitch.tv/helix/users/follows?first=1&to_id=' + this.id, (response) => {
            this.totalFollows = response.total;
            this.lastFollower = response.data[0].from_name;
            callback();
        });
    }
    httpRequest(url, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    callback(JSON.parse(request.response));
                }
            }
        };
        request.open('GET', url, true);
        request.setRequestHeader('Authorization', 'Bearer ' + this.token);
        request.send();
    }
};
