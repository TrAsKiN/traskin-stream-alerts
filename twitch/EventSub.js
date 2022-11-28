'use_strict'

class EventSub extends EventTarget {
    socket = null
    url = 'wss://eventsub-beta.wss.twitch.tv/ws'
    sessionId = null
    keepaliveTimer = null
    lastMessageTimestamp = null
    broadcasterId = null
    timer = null
    subscriptions = []

    constructor(api) {
        super()
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
                    this.sessionId = data.payload.session.id
                    this.keepaliveTimer = data.payload.session.keepalive_timeout_seconds + 1
                    this.initiateTimer(data)
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
                    break
                case 'session_keepalive':
                    console.debug(`Connection still active...`, data)
                    this.initiateTimer(data)
                    break
                case 'notification':
                    console.log(`New notification!`, data)
                    this.initiateTimer(data)
                    switch (data.metadata.subscription_type) {
                        case 'channel.follow':
                            this.dispatchEvent(new CustomEvent('follow', {detail: data.payload.event}))
                            break
                        case 'channel.subscribe':
                            this.dispatchEvent(new CustomEvent('sub', {detail: data.payload.event}))
                            break
                        case 'channel.subscription.gift':
                            this.dispatchEvent(new CustomEvent('subgift', {detail: data.payload.event}))
                            break
                        case 'channel.subscription.message':
                            this.dispatchEvent(new CustomEvent('resub', {detail: data.payload.event}))
                            break
                        case 'channel.cheer':
                            this.dispatchEvent(new CustomEvent('cheer', {detail: data.payload.event}))
                            break
                        case 'channel.raid':
                            this.dispatchEvent(new CustomEvent('raid', {detail: data.payload.event}))
                            break
                        case 'channel.channel_points_custom_reward_redemption.add':
                            this.dispatchEvent(new CustomEvent('channelpoints', {detail: data.payload.event}))
                            break
                    }
                    break
                default:
                    console.log(data)
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
        this.subscriptions.forEach((subscriptionId, index) => {
            this.api.call('/eventsub/subscriptions?id=' + subscriptionId, 'DELETE')
            .then(() => this.subscriptions.splice(index, 1))
        })
    }

    reconnect() {
        console.log(`Reconnection...`)
        this.disconnect()
        this.connect()
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
                this.initiateTimer(message)
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
