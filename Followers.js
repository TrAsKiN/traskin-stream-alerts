'use strict';

class Followers {
    lastFollower;
    lastFollowerName;
    newFollower;
    totalFollowers;
    totalFollowersCount;
    stepTotalFollowers = 10;
    textTotalFollowers = 'Followers';

    constructor(lastFollower, totalFollowers) {
        this.lastFollower = document.querySelector('#last-follower');
        this.newFollower = document.querySelector('#new-follower');
        this.totalFollowers = document.querySelector('#total-followers');
        document.querySelector('#followers').classList.remove('d-none');
        if (!isNaN(JSON.parse(window.localStorage.getItem('stepTotalFollowers')))) {
            this.stepTotalFollowers = JSON.parse(window.localStorage.getItem('stepTotalFollowers'));
        } else {
            window.localStorage.setItem('stepTotalFollowers', JSON.stringify(this.stepTotalFollowers));
        }
        console.debug('Steps for total followers:', JSON.parse(window.localStorage.getItem('stepTotalFollowers')));
        this.initialize(lastFollower, totalFollowers);
    }

    initialize(lastFollower, totalFollowers) {
        this.lastFollower.innerHTML = lastFollower;
        this.lastFollowerName = lastFollower;
        this.totalFollowersCount = totalFollowers;
        this.totalFollowers.innerHTML = this.totalFollowersCount;
        document.querySelector('#total-followers-text').innerHTML = this.textTotalFollowers +' ';
        document.querySelector('#total-followers-step').innerHTML = '/ '+ this.checkStep(this.totalFollowersCount);
        this.newFollower.innerHTML = null;
        this.animate(document.querySelector('#overlay-total-followers'), 'init-in-top').then();
        this.animate(document.querySelector('#overlay-last-follower'), 'init-in-left').then();
    }

    newFollow(newFollower, totalFollowers) {
        this.lastFollowerName = newFollower;
        this.newFollower.innerHTML = this.lastFollowerName;
        this.totalFollowersCount = totalFollowers;
        this.totalFollowers.innerHTML = this.totalFollowersCount;
        document.querySelector('#total-followers-step').innerHTML = '/ '+ this.checkStep(this.totalFollowersCount);
        document.querySelector('#new-follow-sound').play();
        this.animate(this.newFollower, 'focus-in-expand').then(() => {
            window.setTimeout(() => {
                this.animate(this.newFollower, 'slide-out-blurred-bl').then(() => {
                    this.newFollower.innerHTML = null;
                });
                this.animate(this.lastFollower, 'fade-out').then(() => {
                    this.lastFollower.innerHTML = this.lastFollowerName;
                    this.animate(this.lastFollower, 'slide-in-blurred-tr').then();
                });
            }, 5000);
        });
    }

    /**
     * @param element
     * @param animation
     * @returns {Promise<string>}
     */
    animate(element, animation) {
        return new Promise((resolve) => {
            const animationName = animation;

            element.classList.add(animationName);

            element.addEventListener('animationend', () => {
                element.classList.remove(animationName);
                element.removeEventListener('animationend', this);

                resolve('Animation ended');
            });
        });
    }

    checkStep(count) {
        return Math.ceil((count+1)/this.stepTotalFollowers)*this.stepTotalFollowers;
    }
}
