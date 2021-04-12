'use strict';

class Followers {
    lastFollower;
    lastFollowerName;
    newFollower;
    totalFollowers;
    totalFollowersCount;
    stepTotalFollowers = 10;
    textTotalFollowers = 'Followers';
    enableFollowerGoal = true;

    constructor(lastFollower, totalFollowers) {
        this.lastFollower = document.querySelector('#last-follower');
        this.newFollower = document.querySelector('#new-follower');
        this.totalFollowers = document.querySelector('#total-followers');

        document.querySelector('#followers').classList.remove('d-none');

        if (window.localStorage.getItem('stepTotalFollowers')) {
            this.stepTotalFollowers = JSON.parse(window.localStorage.getItem('stepTotalFollowers'));
        } else {
            window.localStorage.setItem('stepTotalFollowers', JSON.stringify(this.stepTotalFollowers));
        }
        console.debug('Steps for total followers:', JSON.parse(window.localStorage.getItem('stepTotalFollowers')));

        if (window.localStorage.getItem('textTotalFollowers')) {
            this.textTotalFollowers = window.localStorage.getItem('textTotalFollowers');
        } else {
            window.localStorage.setItem('textTotalFollowers', this.textTotalFollowers);
        }
        console.debug('Text for total followers:', window.localStorage.getItem('textTotalFollowers'));

        if (window.localStorage.getItem('enableFollowerGoal')) {
            this.enableFollowerGoal = JSON.parse(window.localStorage.getItem('enableFollowerGoal'));
        } else {
            window.localStorage.setItem('enableFollowerGoal', JSON.stringify(this.enableFollowerGoal));
        }
        console.debug('Follower goal:', JSON.parse(window.localStorage.getItem('enableFollowerGoal')));

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
        if (this.enableFollowerGoal) {
            this.animate(document.querySelector('#overlay-total-followers'), 'init-in-top').then();
        } else {
            document.querySelector('#overlay-total-followers').classList.add('d-none');
        }
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
