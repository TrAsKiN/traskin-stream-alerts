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

        // Retrieving user information with access token
        user.getUser()
            .then(() => {
                // Retrieving the last follower and the total number of followers
                user.getLastFollow()
                    .then(() => {
                        const followers = new Followers(user.lastFollower, user.totalFollowers);
                        window.setInterval(() => {
                            user.getLastFollow()
                                .then(() => {
                                    const newFollowers = JSON.parse(window.localStorage.getItem('newFollowers'));
                                    if (user.lastFollower !== followers.lastFollowerName) {
                                        console.log('New follow!');
                                        newFollowers.push(user.lastFollower);
                                    }
                                    window.localStorage.setItem('newFollowers', JSON.stringify(newFollowers));
                                })
                                .catch((error) => {
                                    console.warn(error);
                                });
                        }, 1000);
                        window.setInterval(() => {
                            const newFollowers = JSON.parse(window.localStorage.getItem('newFollowers'));
                            const LastFollowerName = newFollowers.pop();
                            if (user.lastFollower !== LastFollowerName && LastFollowerName !== undefined) {
                                console.log('New follow!');
                                followers.newFollow(user.lastFollower, user.totalFollowers);
                                window.localStorage.setItem('newFollowers', JSON.stringify(newFollowers));
                            }
                        }, 1000);
                    })
                    .catch((error) => {
                        console.warn(error);
                    });

                // Creating and starting the websocket
                const pubsub = new PubSub(socket, user.token, user.id);
                pubsub.start()
                    .then((response) => {
                        console.debug(response);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);

                // Deleting saved information and reloading
                window.localStorage.clear();
                document.location.reload();
            })
        ;
    }
} else if (document.location.hash) {
    if (document.location.hash.slice(1) !== 'dashboard') {
        // Hide login request
        document.getElementById('landing').classList.add('d-none');

        // Access token registration
        window.localStorage.setItem('access_token', document.location.hash.match(/access_token=(\w+)/)[1]);

        if (window.localStorage.getItem('inDashboard')) {
            // Redirection to dashboard
            history.replaceState({}, document.title, window.location.pathname + '#dashboard');
            document.location.reload();
        } else {
            // Redirection to alerts display
            history.replaceState({}, document.title, window.location.pathname);
            document.location.reload();
        }
    }
} else {
    console.info('Use the dashboard, to login, at this address: '+ document.location.origin + document.location.pathname +'#dashboard');
}
