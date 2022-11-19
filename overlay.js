import { LocalStorage } from './components/LocalStorage.js'
import { Followers } from './alerts/Followers.js'
import { Api } from './twitch/Api.js'
import { EventSub } from './twitch/EventSub.js'

const dev = false
const storage = new LocalStorage()
let clientId
let token

if (dev) {
    const host = 'http://localhost'
    const port = '8080'
    const endpoint = new URL('', host)
    endpoint.port = port
    const clients = (await (await fetch(`${endpoint.href}/units/clients`, {mode: 'cors'})).json()).data
    const users = (await (await fetch(`${endpoint.href}/units/users`, {mode: 'cors'})).json()).data
    clientId = clients[0].ID
    const url = new URL('/auth/authorize?'+ decodeURIComponent(new URLSearchParams({
        "client_id": clientId,
        "client_secret": clients[0].Secret,
        "grant_type": "user_token",
        "user_id": users[0].id,
        "scope": [
            'bits:read',
            'channel:read:redemptions',
            'channel:read:subscriptions'
        ].join("+")
    }).toString()), endpoint.href).href
    token = (await (await fetch(url, {method: 'POST'})).json()).access_token
} else { 
    clientId = 'nxyyskr9bnxcy08abnfnhrmxvqtjht'
    token = storage.get('accessToken')
}

if (token) {
    document.querySelector('#overlay').classList.remove('d-none')
    const api = new Api(clientId, token, dev)
    const user = (await (await api.call('/users')).json()).data[0]
    const eventSub = new EventSub(api)
    const follows = await (await api.call(`/users/follows?first=1&to_id=${user.id}`)).json()
    const followers = new Followers(follows.data[0].from_name, follows.total, storage)

    eventSub.connect(dev)
    eventSub.onfollow = async event => {
        if (storage.get('enableFollowAlerts')) {
            const total = (await (await api.call(`/users/follows?first=1&to_id=${user.id}`)).json()).total
            followers.queue(event.user_name, total)
        }
    }
    eventSub.onsub = event => {
        console.log(`New sub!`, event)
    }

    setInterval(() => {
        checkDisplay(document.querySelector('#overlay-total-followers'), 'enableFollowerGoal')
    }, 1000)

    function checkDisplay(element, key) {
        if (storage.get(key)) {
            element.classList.remove('d-none')
        } else if (!element.classList.contains('d-none')) {
            element.classList.add('d-none')
        }
    }
}
