'use_strict'

class EventSub {
    socket = null
    url = 'wss://eventsub-beta.wss.twitch.tv/ws'
    sessionId = null
    keepaliveTimer = null
    lastMessageTimestamp = null
    broadcasterId = null
    timer = null
    subscriptions = []

    constructor(api) {
        this.api = api
    }

    connect(dev = false) {
        if (dev) {
            this.url = 'ws://localhost:8080/eventsub'
        }
        this.socket = new WebSocket(this.url)
        this.socket.onopen = event => {
            console.debug(`Connection open!`, event)
        }
        this.socket.onmessage = event => {
            let data = JSON.parse(event.data)
            switch (data.metadata.message_type) {
                case 'session_welcome':
                    this.onWelcome(data)
                    break
                case 'session_keepalive':
                    this.onKeepalive(data)
                    break
                case 'session_keepalive':
                    this.onKeepalive(data)
                    break
                case 'session_reconnect':
                    this.onReconnect(data)
                    break
                case 'revocation':
                    this.onRevocation(data)
                    break
                case 'notification':
                    this.onNotification(data)
                    break
            }
        }
    }

    disconnect() {
        this.socket.close()
        clearTimeout(this.timer)
        this.timer = null
        this.sessionId = null
        this.keepaliveTimer = null
        this.lastMessageTimestamp = null
        this.subscriptions.forEach(subscriptionId, index => {
            this.api.call('/eventsub/subscriptions?id=' + subscriptionId, 'DELETE')
            .then(() => this.subscriptions.splice(index, 1))
        })
    }

    reconnect() {
        console.log(`Reconnection...`)
        this.disconnect()
        this.connect()
    }

    onWelcome(message) {
        this.sessionId = message.payload.session.id
        this.keepaliveTimer = message.payload.session.keepalive_timeout_seconds + 1
        this.initiateTimer(message)
        this.api.call('/users')
        .then(content => {
            this.broadcasterId = content.data[0].id
            this.subscriptionTo('channel.follow')
            this.subscriptionTo('channel.subscribe')
            this.subscriptionTo('channel.subscription.gift')
            this.subscriptionTo('channel.subscription.message')
            this.subscriptionTo('channel.cheer')
            this.subscriptionTo('channel.raid')
            this.subscriptionTo('channel.channel_points_custom_reward_redemption.add')
            this.removeOldSubscribtions()
        })
    }

    onKeepalive(message) {
        console.debug(`Connection still active...`, message)
        this.initiateTimer(message)
    }

    onPing(message) {
        console.log(`PING`, message)
        this.initiateTimer(message)
    }

    onReconnect(message) {
        console.log(message)
    }

    onRevocation(message) {
        console.log(message)
    }

    onNotification(message) {
        console.log(`New notification!`, message)
        this.initiateTimer(message)
        switch (message.metadata.subscription_type) {
            case 'channel.follow':
                if (typeof this.onfollow === 'function') {
                    this.onfollow(message.payload.event)
                }
                break
            case 'channel.subscribe':
                if (typeof this.onsub === 'function') {
                    this.onsub(message.payload.event)
                }
                break
            case 'channel.subscription.gift':
                if (typeof this.onsubgift === 'function') {
                    this.onsubgift(message.payload.event)
                }
                break
            case 'channel.subscription.message':
                if (typeof this.onresub === 'function') {
                    this.onresub(message.payload.event)
                }
                break
            case 'channel.cheer':
                if (typeof this.oncheer === 'function') {
                    this.oncheer(message.payload.event)
                }
                break
            case 'channel.raid':
                if (typeof this.onraid === 'function') {
                    this.onraid(message.payload.event)
                }
                break
            case 'channel.channel_points_custom_reward_redemption.add':
                if (typeof this.onchannelpoints === 'function') {
                    this.onchannelpoints(message.payload.event)
                }
                break
        }
    }

    initiateTimer(message) {
        if (message.metadata) {
            this.lastMessageTimestamp = new Date(message.metadata.message_timestamp)
        }
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout((() => {
            const now = new Date()
            const elapsedTime = now.getTime() - this.lastMessageTimestamp.getTime()
            if (elapsedTime > (this.keepaliveTimer * 1000)) {
                this.reconnect()
            } else {
                this.initiateTimer()
            }
        }).bind(this), this.keepaliveTimer * 1000)
    }

    removeOldSubscribtions() {
        this.api.call('/eventsub/subscriptions')
        .then(content => {
            if (content.data.length > 0) {
                content.data.forEach(async subscription => {
                    if (subscription.status !== 'enabled') {
                        this.api.call('/eventsub/subscriptions?id=' + subscription.id, 'DELETE')
                    }
                })
            }
        })
    }

    subscriptionTo(channel) {
        this.api.call('/eventsub/subscriptions', 'POST', JSON.stringify({
            "type": channel,
            "version": "1",
            "condition": {
                "broadcaster_user_id": this.broadcasterId,
                "to_broadcaster_user_id": this.broadcasterId
            },
            "transport": {
                "method": "websocket",
                "session_id": this.sessionId
            }
        }))
        .then(content => {
            console.log(`Subscription to "${channel}" done!`, content)
            if (content.data.length > 0) {
                this.subscriptions.push(content.data[0].id)
            }
        })
    }
}

export { EventSub }
