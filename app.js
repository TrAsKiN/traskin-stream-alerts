'use strict';

const socket = new WebSocket('wss://pubsub-edge.twitch.tv:443');
const client_id = 'nxyyskr9bnxcy08abnfnhrmxvqtjht';

var debug_output = document.getElementById('debug');

if (document.location.hash) {
    document.getElementById('landing').classList.add('d-none');

    // Getting the OAuth token
    var app_token = document.location.hash.match(/=([a-z0-9]+)&/)[1];
    console.debug('App token:', app_token);

    getUserID(app_token, (user_id) => {
        pubSub(socket, app_token, user_id);
    })
} else {
    document.getElementById('connect').setAttribute('href', document.getElementById('connect').getAttribute('href').replace('<url>', document.location.href));
    console.info('Please login to continue.');
}

// Retrieving the User ID
function getUserID(oauth_token, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                var user = JSON.parse(httpRequest.response).data[0];
                console.debug('User:', user);
                debug_output.append('User ID: '+ user.id +' ('+ user.display_name +')\n');
                callback(user.id);
            }
        }
    };
    httpRequest.open('GET', 'https://api.twitch.tv/helix/users', true);
    httpRequest.setRequestHeader('Authorization', 'Bearer '+ oauth_token);
    httpRequest.send();
}

function pubSub(socket, auth_token, channel_id) {
    // PING the server every 5 minutes
    var ping = window.setInterval(() => {
        console.log('Sending PING to the server...');
        socket.send(JSON.stringify({"type": "PING"}));
    }, 300000);

    // Managing server returns
    socket.onmessage = (message) => {
        const response = JSON.parse(message.data);
        console.debug('Response message:', response);
        switch (response.type) {
            case 'RESPONSE':
                if (response.error) {
                    console.error('The server returned an error:', response.error);
                    socket.close();
                } else {
                    console.log('The server accepted the request!');
                }
                break;
            case 'MESSAGE':
                console.log('The server has sent a message!');
                break;
            case 'PONG':
                console.log('The server responded PONG to the request!');
                break;
            default:
                console.log('The server responded to the request!');
        }
    }
    socket.onopen = () => {
        console.time('Connection time');
        console.log('Connected! Subscribe to the different topics...');
        socket.send(JSON.stringify({
            'type': 'LISTEN',
            'data': {
                'topics': ['channel-bits-events-v2.'+ channel_id],
                'auth_token': auth_token
            }
        }));
        socket.send(JSON.stringify({
            'type': 'LISTEN',
            'data': {
                'topics': ['whispers.'+ channel_id],
                'auth_token': auth_token
            }
        }));
    }
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    }
    socket.onclose = () => {
        console.log('Connection is closed.');
        console.timeEnd('Connection time');
        window.clearInterval(ping);
    }
}
