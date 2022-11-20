import { LocalStorage } from './components/LocalStorage.js'
import { Overlay } from './components/Overlay.js'
import { Followers } from './components/Followers.js'
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
    const api = new Api(clientId, token, dev)
    const overlay = new Overlay(api, new EventSub(api), storage)
    const follows = await overlay.lastFollow()
    overlay.init({
        followers: new Followers(follows.data[0].from_name, follows.total, storage)
    })
}
