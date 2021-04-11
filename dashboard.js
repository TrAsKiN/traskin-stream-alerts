'use strict';

if (window.localStorage.getItem('access_token')) {
    if (document.location.hash.slice(1) === 'dashboard') {
        console.info('Welcome on the dashboard.');
        document.body.classList.add('bg-dark', 'text-light');

        if (window.localStorage.getItem('stepTotalFollowers') !== null) {
            document.getElementById('stepTotalFollowers').value = JSON.parse(
                window.localStorage.getItem('stepTotalFollowers')
            );
        } else {
            window.localStorage.setItem('stepTotalFollowers', '10');
        }
        if (window.localStorage.getItem('textTotalFollowers') !== null) {
            document.getElementById('textTotalFollowers').value = JSON.parse(
                window.localStorage.getItem('textTotalFollowers')
            );
        } else {
            window.localStorage.setItem('textTotalFollowers', 'Followers');
        }
        if (window.localStorage.getItem('enableFollowAlerts') !== null) {
            document.getElementById('enableFollowAlerts').checked = JSON.parse(
                window.localStorage.getItem('enableFollowAlerts')
            );
        } else {
            window.localStorage.setItem('enableFollowAlerts', 'true');
        }
        if (window.localStorage.getItem('enableFollowerGoal') !== null) {
            document.getElementById('enableFollowerGoal').checked = JSON.parse(
                window.localStorage.getItem('enableFollowerGoal')
            );
        } else {
            window.localStorage.setItem('enableFollowerGoal', 'true');
        }

        document.querySelector('#alertsLink').innerHTML = document.location.origin + document.location.pathname;

        const user = new User(window.localStorage.getItem('access_token'), clientId);

        document.getElementById('dashboard').classList.remove('d-none');
        document.getElementById('testFollow').addEventListener('click', (e) => {
            e.preventDefault();
            user.getUser()
                .then(() => {
                    user.getLastFollow()
                        .then(() => {
                            console.log('Test follow!');
                            const newFollowers = JSON.parse(window.localStorage.getItem('newFollowers'));
                            newFollowers.push('Test_Follow');
                            window.localStorage.setItem('newFollowers', JSON.stringify(newFollowers));
                        })
                        .catch((error) => {
                            console.error(error);
                        })
                    ;
                })
            ;
        });
        document.getElementById('clearStorage').addEventListener('click', (e) => {
            e.preventDefault();
            window.localStorage.clear();
        });
        document.getElementById('textTotalFollowers').addEventListener('change', (e) => {
            window.localStorage.setItem('textTotalFollowers', JSON.stringify(e.target.value));
            console.debug('Text change to:', e.target.value);
        });
        document.getElementById('stepTotalFollowers').addEventListener('change', (e) => {
            window.localStorage.setItem('stepTotalFollowers', JSON.stringify(e.target.value));
            console.debug('Step change to:', e.target.value);
        });
        document.getElementById('enableFollowAlerts').addEventListener('change', (e) => {
            window.localStorage.setItem('enableFollowAlerts', JSON.stringify(e.target.checked));
            console.debug('Follow alert set to:', e.target.checked);
        });
        document.getElementById('enableFollowerGoal').addEventListener('change', (e) => {
            window.localStorage.setItem('enableFollowerGoal', JSON.stringify(e.target.checked));
            console.debug('Follower goal set to:', e.target.checked);
        });
    }
} else if (document.location.hash) {
    if (document.location.hash.slice(1) === 'dashboard') {
        document.body.classList.add('bg-dark', 'text-light');

        // Customization of the url with application information
        document.getElementById('landing').classList.remove('d-none');
        document.getElementById('connect')
            .setAttribute(
                'href',
                document.getElementById('connect')
                    .getAttribute('href')
                    .replace('<url>', document.location.href.split('#')[0])
            )
        ;
        document.getElementById('connect')
            .setAttribute(
                'href',
                document.getElementById('connect')
                    .getAttribute('href')
                    .replace('<client_id>', clientId)
            )
        ;
        console.info('Please login to continue.');
    }
}
