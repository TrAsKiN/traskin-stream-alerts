import { Api, Chat, EventSub } from '@traskin/twitch-tools-js';

export default function Login({ clientId }: { clientId: string }) {
  const authUrl = Api.generateAuthUrl(clientId, [... new Set([
    ... Chat.getScopes(),
    ... EventSub.getScopes()
  ])]);

  return (
    <div className='text-center'>
        <p className='lead'>We need your permission to get all the information from your streams!</p>
        <p><a className='btn btn-primary' href={authUrl}>Connect with Twitch</a></p>
    </div>
  )
}
