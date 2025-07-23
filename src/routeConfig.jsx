import GamePage from "./pages/GamePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import Signup from "./pages/Signup";

const routes = [
    {
        path: '/',
        element : <LandingPage/>
    },
    {
        path: '/game',
        element: <GamePage/>
    },
    {
        path: '/login',
        element: <LoginPage/>
    },
    {
        path: "/signup",
        element: <Signup/>
    }
];

export default routes;