'use strict'

export class Overlay {
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
        this.eventsub.addEventListener('follow', async event => {
            if (this.storage.get('enableFollowAlerts')) {
                const lastFollow = await this.lastFollow()
                alerts.followers.queue(event.detail.user_name, lastFollow.total)
            }
        })
    }

    checkDisplay(element, key) {
        if (this.storage.get(key)) {
            element.classList.remove('d-none')
        } else if (!element.classList.contains('d-none')) {
            element.classList.add('d-none')
        }
    }

    async lastFollow() {
        const user = await this.api.call('/users')
        return await this.api.call(`/users/follows?first=1&to_id=${user.data[0].id}`)
    }
}
