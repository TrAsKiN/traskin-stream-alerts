'use strict';

if (Storage.get('accessToken')) {
    if (document.location.hash.slice(1) === 'dashboard') {
        console.info('Welcome on the dashboard.');
        document.body.classList.add('bg-dark', 'text-light');

        document.getElementById('stepTotalFollowers').value = Storage.get('stepTotalFollowers');
        document.getElementById('textTotalFollowers').value = Storage.get('textTotalFollowers');
        document.getElementById('enableFollowAlerts').checked = Storage.get('enableFollowAlerts');
        document.getElementById('enableFollowerGoal').checked = Storage.get('enableFollowerGoal');

        document.querySelector('#alertsLink').innerHTML = document.location.origin + document.location.pathname;

        const alertLink = document.querySelector('#alertsLink').parentNode;
        if (Storage.get('alertLinkDisabled')) {
            bootstrap.Alert.getOrCreateInstance(alertLink).close();
        } else {
            alertLink.addEventListener('closed.bs.alert', () => {
                Storage.set('alertLinkDisabled', true);
            });
        }

        document.getElementById('dashboard').classList.remove('d-none');
        document.getElementById('testFollow').addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Test follow!');
            const newFollowers = JSON.parse(window.localStorage.getItem('newFollowers'));
            newFollowers.push('Test_Follow');
            Storage.set('newFollowers', newFollowers);
        });
        document.getElementById('clearStorage').addEventListener('click', (e) => {
            e.preventDefault();
            window.localStorage.clear();
        });
        document.getElementById('textTotalFollowers').addEventListener('change', (e) => {
            Storage.set('textTotalFollowers', e.target.value);
        });
        document.getElementById('stepTotalFollowers').addEventListener('change', (e) => {
            Storage.set('stepTotalFollowers', e.target.value);
        });
        document.getElementById('enableFollowAlerts').addEventListener('change', (e) => {
            Storage.set('enableFollowAlerts', e.target.checked);
        });
        document.getElementById('enableFollowerGoal').addEventListener('change', (e) => {
            Storage.set('enableFollowerGoal', e.target.checked);
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
    } else {
        // Hide login request
        document.getElementById('landing').classList.add('d-none');

        // Access token registration
        Storage.set('accessToken', document.location.hash.match(/access_token=(\w+)/)[1]);

        // Redirection to dashboard
        history.replaceState({}, document.title, window.location.pathname + '#dashboard');
        document.location.reload();
    }
}
