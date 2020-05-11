'use strict';

const socket = new WebSocket('wss://pubsub-edge.twitch.tv:443');
const client_id = 'nxyyskr9bnxcy08abnfnhrmxvqtjht';

var debug_output = document.getElementById('debug');

if (document.location.hash) {
    document.getElementById('landing').classList.add('d-none');

    var user = new User(document.location.hash.match(/access_token=(\w+)/)[1]);
    console.debug('App token:', user.token);

    user.getUser(() => {
        debug_output.append('User ID: '+ user.id +' ('+ user.name +')\n');
        var pubsub = new PubSub(socket, user.token, user.id);
        pubsub.start();
        user.getLastFollow(() => {
            debug_output.append('Total followers: '+ user.totalFollows +' (last: '+ user.lastFollower +')\n');
        })
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
                        .replace('<client_id>', client_id)
            )
    ;
    console.info('Please login to continue.');
}
