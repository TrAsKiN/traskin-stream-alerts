'use strict';

const socket = new WebSocket('wss://pubsub-edge.twitch.tv:443');
const clientId = 'nxyyskr9bnxcy08abnfnhrmxvqtjht';

if (window.localStorage.getItem('access_token')) {
    // Hide login request
    document.getElementById('landing').classList.add('d-none');
    document.getElementById('overlay').classList.remove('d-none');

    // User creation with access token
    const user = new User(window.localStorage.getItem('access_token'), clientId);

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
                    if (user.lastFollower != followers.lastFollowerName) {
                        console.log('New follow!');
                        followers.newFollow(user.lastFollower);
                    }
                });
            }, 1000);
        })
        .catch((error) => {
            console.error(error);
        });

        // Creating and starting the websocket
        const pubsub = new PubSub(socket, user.token, user.id);
        pubsub.start((message) => {
            console.debug(message);
        })
        .then(() => {

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
    // Hide login request
    document.getElementById('landing').classList.add('d-none');

    // Access token registration
    window.localStorage.setItem('access_token', document.location.hash.match(/access_token=(\w+)/)[1]);

    // Redirection to alerts display
    history.replaceState({}, document.title, window.location.pathname);
    document.location.reload();
} else {
    // Customization of the url with application information
    document.getElementById('connect')
            .setAttribute(
                'href',
                document.getElementById('connect')
                        .getAttribute('href')
                        .replace('<url>', document.location.href)
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
}
