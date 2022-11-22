'use_strict'

class Api {
    url = 'https://api.twitch.tv/helix'

    constructor(clientId, token, dev = false) {
        this.clientId = clientId
        this.token = token
        if (dev) {
            this.url = 'http://localhost:8000/mock'
        }
    }

    async call(endpoint, method = 'GET', body = null) {
        const headers = new Headers({
            'Authorization': 'Bearer '+ this.token,
            'Client-Id': this.clientId,
        })
        if (body) {
            headers.append('Content-Type', 'application/json')
        }
        const init = {
            method: method,
            headers: headers
        }
        if (body) {
            init.body = body
        }
        const response = await fetch(this.url + endpoint, init)
        return await this.parseResponse(response)
    }

    generateAuthUrl(scopes) {
        return new URL('/oauth2/authorize?'+ decodeURIComponent(new URLSearchParams({
            "client_id": this.clientId,
            "redirect_uri": document.location.href.split('#').shift(),
            "response_type": "token",
            "scope": scopes.join("+")
        }).toString()), 'https://id.twitch.tv/').href
    }

    async parseResponse(response) {
        if (!response.ok) {
            console.debug(response)
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        if (response.status !== 204) {
            return await response.json()
        }
    }
}

export { Api }
