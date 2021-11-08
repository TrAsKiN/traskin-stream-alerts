'use strict';

class LocalStorage {
    constructor() {
        if (window.localStorage.getItem('accessToken')) {
            this.accessToken = JSON.parse(window.localStorage.getItem('accessToken'));
        } else {
            this.accessToken = null;
            window.localStorage.setItem('accessToken', JSON.stringify(this.accessToken));
        }
        if (window.localStorage.getItem('enableFollowAlerts')) {
            this.enableFollowAlerts = JSON.parse(window.localStorage.getItem('enableFollowAlerts'));
        } else {
            this.enableFollowAlerts = true;
            window.localStorage.setItem('enableFollowAlerts', JSON.stringify(this.enableFollowAlerts));
        }
        if (window.localStorage.getItem('enableFollowerGoal')) {
            this.enableFollowerGoal = JSON.parse(window.localStorage.getItem('enableFollowerGoal'));
        } else {
            this.enableFollowerGoal = true;
            window.localStorage.setItem('enableFollowerGoal', JSON.stringify(this.enableFollowerGoal));
        }
        if (window.localStorage.getItem('textTotalFollowers')) {
            this.textTotalFollowers = JSON.parse(window.localStorage.getItem('textTotalFollowers'));
        } else {
            this.textTotalFollowers = 'Followers';
            window.localStorage.setItem('textTotalFollowers', JSON.stringify(this.textTotalFollowers));
        }
        if (window.localStorage.getItem('stepTotalFollowers')) {
            this.stepTotalFollowers = JSON.parse(window.localStorage.getItem('stepTotalFollowers'));
        } else {
            this.stepTotalFollowers = 10;
            window.localStorage.setItem('stepTotalFollowers', JSON.stringify(this.stepTotalFollowers));
        }
        if (window.localStorage.getItem('newFollowers')) {
            this.newFollowers = JSON.parse(window.localStorage.getItem('newFollowers'));
        } else {
            this.newFollowers = [];
            window.localStorage.setItem('newFollowers', JSON.stringify(this.newFollowers));
        }
        if (window.localStorage.getItem('alertLinkDisabled')) {
            this.alertLinkDisabled = JSON.parse(window.localStorage.getItem('alertLinkDisabled'));
        } else {
            this.alertLinkDisabled = false;
            window.localStorage.setItem('alertLinkDisabled', JSON.stringify(this.alertLinkDisabled));
        }
    }

    set(property, newValue) {
        if (this.hasOwnProperty(property)) {
            this[property] = newValue;
            window.localStorage.setItem(property, JSON.stringify(newValue));
            console.debug(`${property} set to:`, this[property]);
        }
    }

    get(property) {
        if (this.hasOwnProperty(property)) {
            return JSON.parse(window.localStorage.getItem(property));
        }
    }
}
