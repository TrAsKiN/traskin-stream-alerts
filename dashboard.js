'use strict';

if (window.localStorage.getItem('access_token')) {
    if (document.location.hash.slice(1) === 'dashboard') {
        console.info('Welcome on the dashboard.');

        document.getElementById('stepTotalFollowers').value = JSON.parse(
            window.localStorage.getItem('stepTotalFollowers')
        );

        document.querySelector('#alertsLink').innerHTML = document.location.origin + document.location.pathname;

        const user = new User(window.localStorage.getItem('access_token'), clientId);

        document.getElementById('dashboard').classList.remove('d-none');
        document.body.classList.add('bg-dark', 'text-light');
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
                        });
                })
            ;
        });
        document.getElementById('clearStorage').addEventListener('click', (e) => {
            e.preventDefault();
            window.localStorage.clear();
        });
        document.getElementById('stepTotalFollowers').addEventListener('change', (e) => {
            window.localStorage.setItem('stepTotalFollowers', JSON.stringify(e.target.value));
            console.log('Step change to:', e.target.value);
        });
    }
} else if (document.location.hash) {
    if (document.location.hash.slice(1) === 'dashboard') {
        document.body.classList.add('bg-dark', 'text-light');
        window.localStorage.setItem('inDashboard', 'true');
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
