'use strict';

const socket = new WebSocket('wss://pubsub-edge.twitch.tv:443');
const clientId = 'nxyyskr9bnxcy08abnfnhrmxvqtjht';

const debug_output = document.getElementById('debug');

if (document.location.hash) {
    document.getElementById('landing').classList.add('d-none');

    const user = new User(document.location.hash.match(/access_token=(\w+)/)[1], clientId);
    console.debug('App token:', user.token);

    user.getUser()
    .then(() => {
        debug_output.append('User ID: '+ user.id +' ('+ user.name +')\n');
        var pubsub = new PubSub(socket, user.token, user.id);
        pubsub.start();
        user.getLastFollow()
        .then(() => {
            debug_output.append('Total followers: '+ user.totalFollows +' (last: '+ user.lastFollower +')\n');
        });
    })
    .catch((error) => {
        console.error(error);
    });
} else {
    debug_output.parentNode.parentNode.classList.add('d-none');
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
