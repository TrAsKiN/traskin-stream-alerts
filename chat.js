import { LocalStorage } from './components/LocalStorage.js'
import { Api, Chat } from './node_modules/@traskin/twitch-tools-js/twitch-tools.js'

const clientId = 'nxyyskr9bnxcy08abnfnhrmxvqtjht'
const storage = new LocalStorage()
const userToken = storage.get('accessToken')
const api = new Api(clientId, userToken)
const chat = new Chat(clientId, userToken)

const globalEmotes = await api.call('/chat/emotes/global')
const globalBadges = await api.call('/chat/badges/global')

function replaceWithEmote (string, emoteName, emoteId) {
    const isLight = !window.matchMedia('(prefers-color-scheme: dark)').matches
    const ImgElement = document.querySelector('#emote-layout').content.querySelector('img').cloneNode()
    let src = globalEmotes.template
    src = src.replace(/\{\{id\}\}/, emoteId)
    src = src.replace(/\{\{format\}\}/, 'default')
    src = src.replace(/\{\{theme_mode\}\}/, isLight ? 'light' : 'dark')
    src = src.replace(/\{\{scale\}\}/, '3.0')
    ImgElement.setAttribute('src', src)
    ImgElement.setAttribute('alt', emoteName)
    return string.replaceAll(emoteName, ImgElement.outerHTML)
}

function getBadgeUrl(setId, version) {
    const badges = globalBadges.data.find(b => {
        if (b.set_id === setId) {
            return true
        }
        return false
    })
    const badge = badges.versions.find(v => {
        if (v.id === version) {
            return true
        }
    })
    return badge.image_url_1x
}

chat.addEventListener('message', ({detail: msg}) => {
    if (msg.rawData.tags && msg.rawData.tags.emotes) {
        const emotes = []
        for (const emoteId in msg.rawData.tags.emotes) {
            for (const position of msg.rawData.tags.emotes[emoteId]) {
                emotes[msg.content.substring(parseInt(position.startPosition), parseInt(position.endPosition) + 1)] = emoteId
            }
        }
        for (const emoteName in emotes) {
            msg.content = replaceWithEmote(msg.content, emoteName, emotes[emoteName])
        }
    }
    const message = document.querySelector('#message-layout').content.querySelector('div').cloneNode(true)
    message.querySelector('.content').innerHTML = msg.content
    message.querySelector('.author').innerHTML = msg.username
    if (msg.rawData.tags && msg.rawData.tags.badges) {
        const badges = []
        for (const badge in msg.rawData.tags.badges) {
            const imgElement = document.querySelector('#badge-layout').content.querySelector('img').cloneNode()
            imgElement.setAttribute('src', getBadgeUrl(badge, msg.rawData.tags.badges[badge]))
            imgElement.setAttribute('alt', badge)
            badges.unshift(imgElement)
        }
        badges.forEach(element => {
            message.querySelector('.author').prepend(element)
        })
    }
    message.dataset.messageId = msg.rawData.tags.id
    message.dataset.userId = msg.rawData.tags['user-id']
    document.querySelector('#app').append(message)
})
chat.addEventListener('clear.chat', ({detail}) => {
    const app = document.querySelector('#app')
    if (detail.userId === null) {
        app.innerHTML = ''
    } else {
        app.querySelectorAll(`.message[data-user-id='${detail.userId}']`).forEach(element => {
            element.remove()
        })
    }
})
chat.addEventListener('clear.message', ({detail}) => {
    const app = document.querySelector('#app')
    if (detail.messageId !== null) {
        app.querySelectorAll(`.message[data-message-id='${detail.messageId}']`).forEach(element => {
            element.remove()
        })
    }
})
chat.connect()
