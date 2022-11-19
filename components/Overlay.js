'use strict'

class Overlay {
    constructor(api, eventsub, storage) {
        this.api = api
        this.eventsub = eventsub
        this.storage = storage
        document.querySelector('#overlay').classList.remove('d-none')
        setInterval(() => {
            this.checkDisplay(document.querySelector('#overlay-total-followers'), 'enableFollowerGoal')
        }, 1000)
    }

    init(alerts, dev = false) {
        this.eventsub.connect(dev)
        this.eventsub.onfollow = async event => {
            if (this.storage.get('enableFollowAlerts')) {
                const total = await this.lastFollow().total
                alerts.followers.queue(event.user_name, total)
            }
        }
        this.eventsub.onsub = event => {
            console.log(`New sub!`, event)
        }
    }

    checkDisplay(element, key) {
        if (this.storage.get(key)) {
            element.classList.remove('d-none')
        } else if (!element.classList.contains('d-none')) {
            element.classList.add('d-none')
        }
    }

    async lastFollow() {
        const user = await this.getUser()
        return await (await this.api.call(`/users/follows?first=1&to_id=${user.id}`)).json()
    }

    async getUser() {
        return await (await (await this.api.call('/users')).json()).data[0]
    }
}

export { Overlay }
