import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import '../styles/main.scss';

export default function Error()
{
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <div className='vw-100 vh-100 d-flex flex-column justify-content-center align-items-center'>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i className='text-muted'>{error.statusText}</i>
        </p>
      </div>
    );
  }

  return (
    <div className='vw-100 vh-100 d-flex flex-column justify-content-center align-items-center flex-wrap'>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
}
