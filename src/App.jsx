import routes from './routeConfig';
import { createBrowserRouter, RouterProvider } from 'react-router';

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;