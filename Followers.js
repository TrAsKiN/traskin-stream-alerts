'use strict';

class Followers {
    lastFollower;
    newFollower;
    totalFollowers;

    constructor(lastFollower, totalFollowers) {
        this.lastFollower = document.querySelector('#last-follower');
        this.newFollower = document.querySelector('#new-follower');
        this.totalFollowers = document.querySelector('#total-followers');
        this.initialize(lastFollower, totalFollowers);
    }

    initialize(lastFollower, totalFollowers) {
        this.lastFollower.innerHTML = lastFollower;
        this.totalFollowers.innerHTML = 'Road to affiliate '+ totalFollowers +' / '+ Math.ceil((totalFollowers+1)/10)*10;
        this.newFollower.innerHTML = null;
        document.querySelector('#followers').classList.remove('d-none');
        this.animate(this.totalFollowers, 'slide-in-blurred-top');
        this.animate(this.lastFollower, 'slide-in-blurred-bl');
    }

    newFollow(newFollower) {
        this.newFollower.innerHTML = newFollower;
        this.animate(this.newFollower, 'focus-in-expand').then(() => {
            window.setTimeout(() => {
                this.animate(this.newFollower, 'slide-out-blurred-bl').then(() => {
                    this.newFollower.innerHTML = null;
                });
                this.animate(this.lastFollower, 'fade-out').then(() => {
                    this.animate(this.lastFollower, 'slide-in-blurred-tr');
                });
            }, 5000);
        });
    }

    animate(element, animation) {
        return new Promise((resolve, reject) => {
            const animationName = animation;

            element.classList.add(animationName);

            element.addEventListener('animationend', () => {
                element.classList.remove(animationName);
                element.removeEventListener('animationend', this);

                resolve('Animation ended');
            });
        })
    }
};
