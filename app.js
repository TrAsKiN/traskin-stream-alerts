'use strict';

const clientId = 'nxyyskr9bnxcy08abnfnhrmxvqtjht';
const Storage = new LocalStorage();

if (Storage.get('accessToken')) {
    if (document.location.hash.slice(1) !== 'dashboard') {
        // Hide login request
        document.getElementById('overlay').classList.remove('d-none');

        // User creation with access token
        const user = new User(Storage.get('accessToken'), clientId);

        // Retrieving user information with access token
        user.getUser()
            .then(() => {
                if (Storage.get('enableFollowAlerts')) {
                    // Retrieving the last follower and the total number of followers
                    user.getLastFollow()
                        .then(() => {
                            const followers = new Followers(user.lastFollower, user.totalFollowers);
                            window.setInterval(() => {
                                const newFollowers = Storage.get('newFollowers');
                                user.getLastFollow()
                                    .then((lastFollowerName) => {
                                        if (
                                            followers.lastFollowerName !== lastFollowerName
                                            && !newFollowers.includes(user.lastFollower)
                                            && followers.lastFollowerName !== 'Test_Follow'
                                        ) {
                                            console.log('New follow!');
                                            newFollowers.push(lastFollowerName);
                                            Storage.set('newFollowers', newFollowers);
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    })
                                ;
                                if (!followers.animating) {
                                    const lastFollowerName = newFollowers.pop();
                                    if (
                                        followers.lastFollowerName !== lastFollowerName
                                        && lastFollowerName !== undefined
                                        || lastFollowerName === 'Test_Follow'
                                    ) {
                                        console.log('New follower animation!');
                                        followers.newFollow(lastFollowerName, user.totalFollowers);
                                        Storage.set('newFollowers', newFollowers);
                                    }
                                }
                            }, 1000);
                        })
                        .catch((error) => {
                            console.warn(error);
                        })
                    ;
                }

                // Creating and starting the websocket
                const pubsub = new PubSub(user.token, user.id);
                pubsub.start();
            })
            .catch((error) => {
                console.error(error);

                // Deleting saved information and reloading
                window.localStorage.clear();
                document.location.reload();
            })
        ;
    }
}
