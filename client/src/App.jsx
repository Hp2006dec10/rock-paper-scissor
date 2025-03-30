import routes from './routeConfig';
import { createBrowserRouter, RouterProvider } from 'react-router';
import MobilePage from './MobilePage';

// Function to check if the device is mobile, including tablets and iPads
const isMobileDevice = () => {
  return /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(navigator.userAgent);
};

const router = createBrowserRouter(routes);

function App() {
  return isMobileDevice() ? <MobilePage /> : <RouterProvider router={router} />;
}

export default App;