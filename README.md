# TrAsKiN Stream Alerts

## Features

- [x] Follower alert
- [x] Follower goal
- [x] Chat
- [ ] Bits alert (partial)
- [ ] Sub, resub, gift alert (partial)
- [ ] Channel point alert (partial)
- [ ] Raid alert (partial)
- [ ] Goals (partial)

## How to add TrAsKiN Stream Alerts in OBS Studio?

### Add the dashboard

- In the *OBS Studio* menu **View** then **Docks**, click on **Custom Browser Docks...**.
- In the **Dock Name** column enter `Dashboard`
- In the **URL** column enter **https://traskin.github.io/traskin-stream-alerts/**

A window appears in which you can log in. You can anchor this window anywhere in OBS Studio.

### Add alerts display

- Add a **browser source** in the *scene* where you want to add the alerts
- In the **URL** field use the following address: **https://traskin.github.io/traskin-stream-alerts/overlay.html**
- Set the **width** and **height** of the source to match your *screen resolution*

It is normal that you still do not see the alerts display if you have not logged in.

### Add chat display

- Add a **browser source** in the *scene* where you want to add the chat
- In the **URL** field use the following address: **https://traskin.github.io/traskin-stream-alerts/chat.html**
- Set the **width** and **height** of the source

It is normal that you still do not see the chat display if you have not logged in.
