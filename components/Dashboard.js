'use strict'

export class Dashboard {
    constructor(api, storage, bootstrap) {
        this.api = api
        this.storage = storage
        this.bootstrap = bootstrap
        document.querySelector('#landing').classList.add('d-none')
        document.querySelector('#dashboard').classList.remove('d-none')
        document.querySelector('#clearStorage').addEventListener('click', e => {
            e.preventDefault()
            window.localStorage.clear()
        })
    }

    onTextChange(input, key) {
        input.addEventListener('change', event => {
            this.storage.set(key, event.target.value)
        })
    }

    onCheckboxChange(input, key) {
        input.addEventListener('change', event => {
            this.storage.set(key, event.target.checked)
        })
    }

    alertLink(element) {
        if (this.storage.get('alertLinkDisabled')) {
            this.bootstrap.Alert.getOrCreateInstance(element.parentNode).close()
        } else {
            element.parentNode.classList.remove('d-none')
            element.innerHTML = document.location.origin + document.location.pathname + 'overlay.html'
            element.parentNode.addEventListener('closed.bs.alert', () => {
                this.storage.set('alertLinkDisabled', true)
            })
        }
    }
}
