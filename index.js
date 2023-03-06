import { LocalStorage } from './components/LocalStorage.js'
import { Dashboard } from './components/Dashboard.js'
import { Api, Chat, EventSub } from './node_modules/@traskin/twitch-tools-js/twitch-tools.js'

const dev = false
const storage = new LocalStorage()
const scopes = [... new Set([
    ... Chat.getScopes(),
    ... EventSub.getScopes()
])]
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
        "scope": scopes.join("+")
    }).toString()), endpoint.href).href
    token = (await (await fetch(url, {method: 'POST'})).json()).access_token
} else { 
    clientId = 'nxyyskr9bnxcy08abnfnhrmxvqtjht'
    token = storage.get('accessToken')
}

const api = new Api(clientId, token)

if (!token) {
    if (document.location.hash) {
        const accessToken = document.location.hash.match(/access_token=(\w+)/)[1]
        if (accessToken) {
            storage.set('accessToken', accessToken)
            history.replaceState({}, document.title, document.location.pathname)
            document.location.reload()
        }
    }
    document.querySelector('#connect').setAttribute('href', Api.generateAuthUrl(clientId, scopes))
    document.querySelector('#landing').classList.remove('d-none')
} else {
    const dashboard = new Dashboard(api, storage, bootstrap)
    dashboard.alertLink(document.querySelector('#alertsLink'))
    dashboard.onTextChange(document.querySelector('#textTotalFollowers'), 'textTotalFollowers')
    dashboard.onTextChange(document.querySelector('#stepTotalFollowers'), 'stepTotalFollowers')
    dashboard.onCheckboxChange(document.querySelector('#enableFollowAlerts'), 'enableFollowAlerts')
    dashboard.onCheckboxChange(document.querySelector('#enableFollowerGoal'), 'enableFollowerGoal')
}
