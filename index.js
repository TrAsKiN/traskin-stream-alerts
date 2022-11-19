import { LocalStorage } from './components/LocalStorage.js'
import { Dashboard } from './components/Dashboard.js'
import { Api } from './twitch/Api.js'

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

const api = new Api(clientId, token, dev)

// window.localStorage.clear()

if (!token) {
    if (document.location.hash) {
        const accessToken = document.location.hash.match(/access_token=(\w+)/)[1]
        if (accessToken) {
            storage.set('accessToken', accessToken)
            history.replaceState({}, document.title, document.location.pathname)
            document.location.reload()
        }
    }
    document.querySelector('#connect').setAttribute('href', api.generateAuthUrl([
        'bits:read',
        'channel:read:redemptions',
        'channel:read:subscriptions'
    ]))
    document.querySelector('#landing').classList.remove('d-none')
} else {
    const dashboard = new Dashboard(api, storage, bootstrap)
    dashboard.alertLink(document.querySelector('#alertsLink'))
    dashboard.onTextChange(document.querySelector('#textTotalFollowers'), 'textTotalFollowers')
    dashboard.onTextChange(document.querySelector('#stepTotalFollowers'), 'stepTotalFollowers')
    dashboard.onCheckboxChange(document.querySelector('#enableFollowAlerts'), 'enableFollowAlerts')
    dashboard.onCheckboxChange(document.querySelector('#enableFollowerGoal'), 'enableFollowerGoal')
}
