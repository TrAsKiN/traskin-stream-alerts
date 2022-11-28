'use_strict'

class Chat extends EventTarget {
    socket = null
    url = 'ws://irc-ws.chat.twitch.tv'
    channel = null
    token = null
    nickname = null

    constructor(api, token, nickname) {
        super()
        this.api = api
        this.token = token
        this.nickname = nickname
    }

    connect(channel) {
        this.channel = `#${channel}`
        this.socket = new WebSocket(this.url)
        this.socket.onopen = event => {
            console.debug(`Connection open!`, event)
            this.socket.send(`PASS oauth:${this.token}`)
            this.socket.send(`NICK ${this.nickname}`)
            this.socket.send(`CAP REQ :twitch.tv/commands twitch.tv/tags twitch.tv/membership`)
            this.socket.send(`JOIN ${this.channel}`)
        }
        this.socket.onclose = event => {
            console.log(`Connection closed!`, event)
        }
        this.socket.onmessage = event => {
            const data = this.parseMessage(event.data)
            console.debug(data, event)
            if (data) {
                switch (data.command.command) {
                    case 'PING':
                        console.log(`Sending 'PONG :${data.parameters.trim()}'`)
                        this.socket.send(`PONG :${data.parameters.trim()}`)
                        break
                    case 'PRIVMSG':
                        console.log(`New chat message!`, data)
                        this.dispatchEvent(new CustomEvent('message', {detail: {
                            username: data.tags['display-name'],
                            content: data.parameters.trim(),
                            rawData: data
                        }}))
                        break
                    case 'JOIN':
                        console.log(`${data.source.nick} has join the chat!`)
                        this.dispatchEvent(new CustomEvent('join', {detail: {
                            username: data.source.nick,
                            rawData: data
                        }}))
                        break
                    case 'PART':
                        console.log(`${data.source.nick} has left the chat!`)
                        this.dispatchEvent(new CustomEvent('left', {detail: {
                            username: data.source.nick,
                            rawData: data
                        }}))
                        break
                }
            }
        }
    }

    parseMessage(message) {
        let parsedMessage = {
            tags: null,
            source: null,
            command: null,
            parameters: null
        }

        let idx = 0

        let rawTagsComponent = null
        let rawSourceComponent = null
        let rawCommandComponent = null
        let rawParametersComponent = null

        if (message[idx] === '@') {
            let endIdx = message.indexOf(' ')
            rawTagsComponent = message.slice(1, endIdx)
            idx = endIdx + 1
        }

        if (message[idx] === ':') {
            idx += 1
            let endIdx = message.indexOf(' ', idx)
            rawSourceComponent = message.slice(idx, endIdx)
            idx = endIdx + 1
        }

        let endIdx = message.indexOf(':', idx)
        if (-1 == endIdx) {
            endIdx = message.length
        }

        rawCommandComponent = message.slice(idx, endIdx).trim()

        if (endIdx != message.length) {
            idx = endIdx + 1
            rawParametersComponent = message.slice(idx)
        }

        parsedMessage.command = this.parseCommand(rawCommandComponent)

        if (null == parsedMessage.command) {
            return null
        } else {
            if (null != rawTagsComponent) {
                parsedMessage.tags = this.parseTags(rawTagsComponent)
            }

            parsedMessage.source = this.parseSource(rawSourceComponent)

            parsedMessage.parameters = rawParametersComponent
            if (rawParametersComponent && rawParametersComponent[0] === '!') {
                parsedMessage.command = this.parseParameters(rawParametersComponent, parsedMessage.command)
            }
        }

        return parsedMessage
    }

    parseTags(tags) {
        const tagsToIgnore = {
            'client-nonce': null,
            'flags': null
        }

        let dictParsedTags = {}
        let parsedTags = tags.split(';')

        parsedTags.forEach(tag => {
            let parsedTag = tag.split('=')
            let tagValue = (parsedTag[1] === '') ? null : parsedTag[1]

            switch (parsedTag[0]) {
                case 'badges':
                case 'badge-info':
                    if (tagValue) {
                        let dict = {}
                        let badges = tagValue.split(',')
                        badges.forEach(pair => {
                            let badgeParts = pair.split('/')
                            dict[badgeParts[0]] = badgeParts[1]
                        })
                        dictParsedTags[parsedTag[0]] = dict
                    } else {
                        dictParsedTags[parsedTag[0]] = null
                    }
                    break
                case 'emotes':
                    if (tagValue) {
                        let dictEmotes = {}
                        let emotes = tagValue.split('/')
                        emotes.forEach(emote => {
                            let emoteParts = emote.split(':')

                            let textPositions = []
                            let positions = emoteParts[1].split(',')
                            positions.forEach(position => {
                                let positionParts = position.split('-')
                                textPositions.push({
                                    startPosition: positionParts[0],
                                    endPosition: positionParts[1]
                                })
                            })

                            dictEmotes[emoteParts[0]] = textPositions
                        })

                        dictParsedTags[parsedTag[0]] = dictEmotes
                    } else {
                        dictParsedTags[parsedTag[0]] = null
                    }
                    break
                case 'emote-sets':
                    let emoteSetIds = tagValue.split(',')
                    dictParsedTags[parsedTag[0]] = emoteSetIds
                    break
                default:
                    if (!tagsToIgnore.hasOwnProperty(parsedTag[0])) {
                        dictParsedTags[parsedTag[0]] = tagValue
                    }
            }
        })

        return dictParsedTags;
    }

    parseCommand(rawCommandComponent) {
        let parsedCommand = null
        let commandParts = rawCommandComponent.split(' ')

        switch (commandParts[0]) {
            case 'JOIN':
            case 'PART':
            case 'NOTICE':
            case 'CLEARCHAT':
            case 'HOSTTARGET':
            case 'PRIVMSG':
                parsedCommand = {
                    command: commandParts[0],
                    channel: commandParts[1]
                }
                break
            case 'PING':
                parsedCommand = {
                    command: commandParts[0]
                }
                break
            case 'CAP':
                parsedCommand = {
                    command: commandParts[0],
                    isCapRequestEnabled: (commandParts[2] === 'ACK') ? true : false,
                }
                break
            case 'GLOBALUSERSTATE':
                parsedCommand = {
                    command: commandParts[0]
                }
                break
            case 'USERSTATE':
            case 'ROOMSTATE':
                parsedCommand = {
                    command: commandParts[0],
                    channel: commandParts[1]
                }
                break
            case 'RECONNECT':
                console.log('The Twitch IRC server is about to terminate the connection for maintenance.')
                parsedCommand = {
                    command: commandParts[0]
                }
                break
            case '421':
                console.log(`Unsupported IRC command: ${commandParts[2]}`)
                return null
            case '001':
                parsedCommand = {
                    command: commandParts[0],
                    channel: commandParts[1]
                }
                break
            case '002':
            case '003':
            case '004':
            case '353':
            case '366':
            case '372':
            case '375':
            case '376':
                console.debug(`numeric message: ${commandParts[0]}`)
                return null
            default:
                console.log(`\nUnexpected command: ${commandParts[0]}\n`)
                return null
        }

        return parsedCommand
    }

    parseSource(rawSourceComponent) {
        if (null == rawSourceComponent) {
            return null
        } else {
            let sourceParts = rawSourceComponent.split('!')
            return {
                nick: (sourceParts.length == 2) ? sourceParts[0] : null,
                host: (sourceParts.length == 2) ? sourceParts[1] : sourceParts[0]
            }
        }
    }

    parseParameters(rawParametersComponent, command) {
        let idx = 0
        let commandParts = rawParametersComponent.slice(idx + 1).trim()
        let paramsIdx = commandParts.indexOf(' ')

        if (-1 == paramsIdx) {
            command.botCommand = commandParts.slice(0)
        }
        else {
            command.botCommand = commandParts.slice(0, paramsIdx)
            command.botCommandParams = commandParts.slice(paramsIdx).trim()
        }

        return command
    }
}

export { Chat }
