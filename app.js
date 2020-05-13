'use strict';

const socket = new WebSocket('wss://pubsub-edge.twitch.tv:443');
const clientId = 'nxyyskr9bnxcy08abnfnhrmxvqtjht';
const debugOutput = document.getElementById('debug');

if (document.location.hash) {
    // Hide login request
    document.getElementById('landing').classList.add('d-none');

    // User creation with access token
    const user = new User(document.location.hash.match(/access_token=(\w+)/)[1], clientId);

    // Retrieving user information with access token
    user.getUser()
    .then(() => {
        // Retrieving the last follower and the total number of followers
        user.getLastFollow();

        // Creating and starting the websocket
        const pubsub = new PubSub(socket, user.token, user.id);
        pubsub.start();
    })
    .catch((error) => {
        console.error(error);
    });
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
