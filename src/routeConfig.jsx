import GamePage from "./pages/GamePage";
import LandingPage from "./pages/LandingPage";

const routes = [
    {
        path: '/',
        element : <LandingPage/>
    },
    {
        path: '/game',
        element: <GamePage/>
    }
];

export default routes;