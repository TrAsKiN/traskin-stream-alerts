'use strict';

const socket = new WebSocket('wss://pubsub-edge.twitch.tv:443');
const clientId = 'nxyyskr9bnxcy08abnfnhrmxvqtjht';

if (window.localStorage.getItem('access_token')) {
    if (document.location.hash.slice(1) !== 'dashboard') {
        // Hide login request
        document.getElementById('overlay').classList.remove('d-none');

        // User creation with access token
        const user = new User(window.localStorage.getItem('access_token'), clientId);

        window.localStorage.setItem('newFollowers', JSON.stringify([]));

        let followAlerts = true;
        if (window.localStorage.getItem('enableFollowAlerts')) {
            followAlerts = JSON.parse(
                window.localStorage.getItem('enableFollowAlerts')
            );
        }

        // Retrieving user information with access token
        user.getUser()
            .then(() => {
                if (followAlerts) {
                    // Retrieving the last follower and the total number of followers
                    user.getLastFollow()
                        .then(() => {
                            const followers = new Followers(user.lastFollower, user.totalFollowers);
                            window.setInterval(() => {
                                user.getLastFollow()
                                    .then(() => {
                                        const newFollowers = JSON.parse(window.localStorage.getItem('newFollowers'));
                                        if (user.lastFollower !== followers.lastFollowerName && followers.lastFollowerName !== 'Test_Follow') {
                                            console.log('New follow!');
                                            newFollowers.push(user.lastFollower);
                                        }
                                        window.localStorage.setItem('newFollowers', JSON.stringify(newFollowers));
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    })
                                ;
                            }, 1000);
                            window.setInterval(() => {
                                const newFollowers = JSON.parse(window.localStorage.getItem('newFollowers'));
                                const LastFollowerName = newFollowers.pop();
                                if (user.lastFollower !== LastFollowerName && LastFollowerName !== undefined) {
                                    console.log('New follow!');
                                    followers.newFollow(LastFollowerName, user.totalFollowers);
                                    window.localStorage.setItem('newFollowers', JSON.stringify(newFollowers));
                                }
                            }, 1000);
                        })
                        .catch((error) => {
                            console.warn(error);
                        })
                    ;
                }

                // Creating and starting the websocket
                const pubsub = new PubSub(socket, user.token, user.id);
                pubsub.start()
                    .then((response) => {
                        console.debug(response);
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                ;
            })
            .catch((error) => {
                console.error(error);

                // Deleting saved information and reloading
                window.localStorage.clear();
                document.location.reload();
            })
        ;
    }
}
