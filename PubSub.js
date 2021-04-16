'use strict';

class PubSub {
    socket;
    token;
    channel;

    constructor(token, channel) {
        this.token = token;
        this.channel = channel;
    }

    start() {
        this.socket = new WebSocket('wss://pubsub-edge.twitch.tv:443');
        let ping = window.setInterval(() => {
            console.log('Sending PING to the server...');
            this.socket.send(JSON.stringify({"type": "PING"}));
        }, 300000);

        this.socket.onmessage = (message) => {
            const response = JSON.parse(message.data);
            console.debug('Response message:', response);
            switch (response.type) {
                case 'RESPONSE':
                    if (response.error) {
                        console.error('The server returned an error:', response.error);
                        this.socket.close();
                    } else {
                        console.log('The server accepted the request!');
                    }
                    break;
                case 'MESSAGE':
                    console.log('The server has sent a message!');
                    console.debug('Response data:', response.data);
                    let body = response.data;
                    if (body.topic === 'channel-bits-events-v2.'+ this.channel) {
                        console.debug('Bits message:', body.message);
                    }
                    if (body.topic === 'channel-points-channel-v1.'+ this.channel) {
                        console.debug('Channel points message:', body.message);
                    }
                    if (body.topic === 'channel-subscribe-events-v1.'+ this.channel) {
                        console.debug('Subscribe message:', body.message);
                    }
                    break;
                case 'PONG':
                    console.log('The server responded PONG to the request!');
                    break;
                case 'RECONNECT':
                    console.error('Need to reconnect!');
                    this.socket = null;
                    this.start();
                    break;
                default:
                    console.log('The server responded to the request!');
            }
        }
        this.socket.onopen = () => {
            console.time('Connection time');
            console.log('Connected! Subscribe to the different topics...');
            this.socket.send(JSON.stringify({
                'type': 'LISTEN',
                'data': {
                    'topics': [
                        'channel-bits-events-v2.'+ this.channel,
                        'channel-points-channel-v1.'+ this.channel,
                        'channel-subscribe-events-v1.'+ this.channel
                    ],
                    'auth_token': this.token
                }
            }));
        }
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.socket = null;
        }
        this.socket.onclose = () => {
            console.log('Connection is closed.');
            console.timeEnd('Connection time');
            window.clearInterval(ping);
            this.socket = null;
        }
    }
}
