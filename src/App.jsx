import routes from './routeConfig';
import { createBrowserRouter, RouterProvider } from 'react-router';
import GlitterTrail from './components/GlitterTrail';

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <GlitterTrail />
      <RouterProvider router={router} />
    </>
  );
}

export default App;