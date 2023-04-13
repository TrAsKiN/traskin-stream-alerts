import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './routes/Dashboard';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Error from './routes/Error';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    errorElement: <Error />,
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
