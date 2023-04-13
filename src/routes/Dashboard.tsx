import { useLocation } from 'react-router';
import Login from '../components/Login';
import '../styles/main.scss';
import Panel from '../components/Panel';

const clientId = 'nxyyskr9bnxcy08abnfnhrmxvqtjht';

export default function Dashboard() {
  const hash = useLocation().hash.slice(1) || null;
  const accessToken = hash?.match(/access_token=(\w+)/)?.slice(1).shift();

  return (
    <div className='container-fluid py-3'>
      { accessToken ? <Panel clientId={clientId} /> : <Login clientId={clientId} /> }
    </div>
  );
}
