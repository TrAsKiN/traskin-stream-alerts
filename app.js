'use strict';

const socket = new WebSocket('wss://pubsub-edge.twitch.tv:443');
const clientId = 'nxyyskr9bnxcy08abnfnhrmxvqtjht';

document.getElementById('landing').classList.add('d-none');

if (window.localStorage.getItem('access_token')) {
    // Hide login request
    document.getElementById('overlay').classList.remove('d-none');

    // User creation with access token
    const user = new User(window.localStorage.getItem('access_token'), clientId);

    // Retrieving user information with access token
    user.getUser()
    .then(() => {
        console.debug(user);
        // Retrieving the last follower and the total number of followers
        user.getLastFollow()
        .then(() => {
            const followers = new Followers(user.lastFollower, user.totalFollowers);
            window.setInterval(() => {
                user.getLastFollow()
                .then(() => {
                    if (user.lastFollower !== followers.lastFollowerName) {
                        console.log('New follow!');
                        followers.newFollow(user.lastFollower, user.totalFollowers);
                    }
                });
            }, 1000);
        })
        .catch((error) => {
            console.error(error);
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
    });
} else if (document.location.hash) {
    if (document.location.hash.slice(1) === 'dashboard') {
        // Customization of the url with application information
        document.getElementById('landing').classList.remove('d-none');
        document.getElementById('connect')
            .setAttribute(
                'href',
                document.getElementById('connect')
                    .getAttribute('href')
                    .replace('<url>', document.location.href.split('#')[0])
            )
        ;
        document.getElementById('connect')
            .setAttribute(
                'href',
                document.getElementById('connect')
                    .getAttribute('href')
                    .replace('<client_id>', clientId)
            )
        ;
        console.info('Please login to continue.');
    } else {
        // Hide login request
        document.getElementById('landing').classList.add('d-none');

        // Access token registration
        window.localStorage.setItem('access_token', document.location.hash.match(/access_token=(\w+)/)[1]);

        // Redirection to alerts display
        history.replaceState({}, document.title, window.location.pathname);
        document.location.reload();
    }
} else {
    console.info('Use the dashboard, to login, at this address: '+ document.location.origin + document.location.pathname +'#dashboard');
}
