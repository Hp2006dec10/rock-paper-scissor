import routes from './routeConfig';
import { createBrowserRouter, RouterProvider } from 'react-router';
import TorchEffect from './components/TorchEffect';

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <TorchEffect />
      <RouterProvider router={router} />
    </>
  );
}

export default App;