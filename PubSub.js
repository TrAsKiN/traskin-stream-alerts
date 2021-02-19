'use strict';

class PubSub {
    socket;
    token;
    channel;

    constructor(socket, token, channel) {
        this.socket = socket;
        this.token = token;
        this.channel = channel;
    }

    /**
     * @returns {Promise<json>}
     */
    start() {
        return new Promise((resolve, reject) =>{
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
                            reject(response.error);
                        } else {
                            console.log('The server accepted the request!');
                        }
                        break;
                    case 'MESSAGE':
                        console.log('The server has sent a message!');
                        console.log(response.data);
                        resolve(response.data);
                        break;
                    case 'PONG':
                        console.log('The server responded PONG to the request!');
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
                reject(error);
            }
            this.socket.onclose = () => {
                console.log('Connection is closed.');
                console.timeEnd('Connection time');
                window.clearInterval(ping);
            }
        });
    }
}
